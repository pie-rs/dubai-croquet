import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

import { cssClassesFromFilePath, urlPathFromFilePath } from '../utils/page-utils';

const PROJECT_ROOT = process.cwd();
const PAGES_ROOT = path.join(PROJECT_ROOT, 'content/pages');
const DATA_ROOT = path.join(PROJECT_ROOT, 'content/data');

async function walkFiles(rootDir) {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const absolutePath = path.join(rootDir, entry.name);
            if (entry.isDirectory()) {
                return walkFiles(absolutePath);
            }
            return [absolutePath];
        })
    );
    return files.flat();
}

function toPosixPath(filePath) {
    return filePath.split(path.sep).join('/');
}

function createMetadata({ absolutePath, sourceName, sourceRoot, extra = {} }) {
    const relProjectPath = toPosixPath(path.relative(PROJECT_ROOT, absolutePath));
    const relSourcePath = toPosixPath(path.relative(sourceRoot, absolutePath));
    return {
        id: relProjectPath,
        sourceName,
        sourcePath: sourceRoot,
        relSourcePath,
        relProjectPath,
        ...extra
    };
}

async function readPageObject(absolutePath) {
    const raw = await fs.readFile(absolutePath, 'utf8');
    const parsed = matter(raw);
    const metadata = createMetadata({
        absolutePath,
        sourceName: 'pages',
        sourceRoot: PAGES_ROOT,
        extra: {
            urlPath: urlPathFromFilePath(toPosixPath(path.relative(PAGES_ROOT, absolutePath))),
            pageCssClasses: cssClassesFromFilePath(toPosixPath(path.relative(PAGES_ROOT, absolutePath)))
        }
    });

    return {
        __metadata: metadata,
        ...parsed.data,
        markdown_content: parsed.content || null
    };
}

async function readDataObject(absolutePath) {
    const raw = await fs.readFile(absolutePath, 'utf8');
    const metadata = createMetadata({
        absolutePath,
        sourceName: 'data',
        sourceRoot: DATA_ROOT
    });

    return {
        __metadata: metadata,
        ...JSON.parse(raw)
    };
}

export async function getSourceData() {
    const [pageFiles, dataFiles] = await Promise.all([walkFiles(PAGES_ROOT), walkFiles(DATA_ROOT)]);
    const markdownFiles = pageFiles.filter((filePath) => filePath.endsWith('.md')).sort();
    const jsonFiles = dataFiles.filter((filePath) => filePath.endsWith('.json')).sort();

    const [pages, dataObjects] = await Promise.all([
        Promise.all(markdownFiles.map(readPageObject)),
        Promise.all(jsonFiles.map(readDataObject))
    ]);

    const objects = [...pages, ...dataObjects];
    const site = objects.find((object) => object.__metadata?.id === 'content/data/config.json') || null;

    return {
        objects,
        pages,
        props: {
            site
        }
    };
}
