---
title: Home
layout: PageLayout
sections:
  - type: HeroSection
    elementId: homepage-hero-1
    colors: colors-a
    title: It's Dubai & it's Croquet.
    subtitle: 'A game of skill, underhanded compliments and filthily polite smack talk.'
    actions:
      - type: Link
        label: Learn More
        url: /the-game
        showIcon: true
        icon: arrowRight
        iconPosition: right
    media:
      type: ImageBlock
      url: /images/ben-claire-hywell.jpg
      altText: Image alt text
      caption: Image caption
    styles:
      self:
        height: auto
        width: wide
        margin:
          - mt-0
          - mb-0
          - ml-0
          - mr-0
        padding:
          - pt-12
          - pb-28
          - pr-4
          - pl-4
        alignItems: center
        justifyContent: center
        flexDirection: row
      title:
        textAlign: left
      subtitle:
        textAlign: left
      text:
        textAlign: left
      actions:
        justifyContent: flex-start
  - elementId: ''
    colors: colors-h
    title: The 2023 Croquet Season is Upon Us
    subtitle: It's serious. It's time to play with some balls.
    text: >
      Croquet is basically the best thing since sliced bread.  If you disagree,
      stop reading.
    styles:
      self:
        height: auto
        width: wide
        margin:
          - mt-0
          - mb-0
          - ml-0
          - mr-0
        padding:
          - pt-24
          - pb-24
          - pl-4
          - pr-4
        justifyContent: center
        borderWidth: 0
        borderColor: border-complementary
        borderRadius: medium
        borderStyle: solid
      title:
        textAlign: center
      subtitle:
        textAlign: center
      text:
        textAlign: center
    type: TextSection
  - type: HeroSection
    elementId: ''
    colors: colors-a
    title: The 2023 Clements Cup
    subtitle: Season Opener - 18th February
    text: >
      It's so on. Game-time mallet fans. Get those whites starched and cravats
      oiled.
    actions:
      - type: Button
        label: What even is this? Tell me more...
        url: /dubai-croquet-2023-clements-cup-season-opener/
        style: primary
        altText: learn more link
    media:
      type: ImageBlock
      altText: Clements Cup Trophy
      url: /images/trophy2.jpg
    styles:
      self:
        height: auto
        width: wide
        margin:
          - mt-0
          - mb-0
          - ml-0
          - mr-0
        padding:
          - pt-12
          - pb-12
          - pl-4
          - pr-4
        alignItems: center
        justifyContent: center
        flexDirection: row
      title:
        textAlign: left
      subtitle:
        textAlign: left
      text:
        textAlign: left
      actions:
        justifyContent: flex-start
  - elementId: ''
    colors: colors-a
    backgroundSize: full
    title: 'OMG Stop it already, lets do this'
    text: |
      "I'm excited, I'm limbered up AND I look fabulous in white. 

      Show me the money baby, where do I sign up....?"
    actions:
      - type: Button
        label: Lets play ball
        url: /events
        style: primary
    styles:
      self:
        height: auto
        width: narrow
        margin:
          - mt-0
          - mb-0
          - ml-0
          - mr-0
        padding:
          - pt-24
          - pb-24
          - pl-4
          - pr-4
        alignItems: center
        justifyContent: center
        flexDirection: col
      title:
        textAlign: left
      text:
        textAlign: left
      actions:
        justifyContent: flex-start
    type: CtaSection
  - colors: colors-h
    elementId: ''
    title: Why Should I Start Playing Croquet
    subtitle: There are so many reasons to start playing croquet in Dubai
    items:
      - type: FeaturedItem
        title: Better Looking
        text: |
          You will become 120% more attractive and alluring.
        featuredImage:
          type: ImageBlock
          url: /images/faster.svg
          altText: Item image
        styles:
          self:
            textAlign: center
      - type: FeaturedItem
        title: Smarter
        text: >
          Once you have wrapped your head around the rules , you'll be doing
          Sudokus faster than your grandmother.
        featuredImage:
          type: ImageBlock
          url: /images/smarter.svg
          altText: Item image
        styles:
          self:
            textAlign: center
      - type: FeaturedItem
        title: Stronger
        text: |
          Croquet will make you strong like an animal.
        featuredImage:
          type: ImageBlock
          url: /images/focused.svg
          altText: Item image
        styles:
          self:
            textAlign: center
    actions: []
    columns: 3
    enableHover: false
    styles:
      self:
        height: auto
        width: wide
        margin:
          - mt-0
          - mb-0
          - ml-0
          - mr-0
        padding:
          - pt-12
          - pb-12
          - pl-4
          - pr-4
        justifyContent: center
      title:
        textAlign: center
      subtitle:
        textAlign: center
      actions:
        justifyContent: center
    type: FeaturedItemsSection
  - elementId: ''
    colors: colors-a
    variant: variant-a
    title: ''
    subtitle: ''
    testimonials:
      - quote: |
          "After our humble and wildly successful victory at the 2021 Clements
          Cup, we cannot wait to see how this season plays out"
        name: The Captain
        title: 'Chairperson, Captain & Generally General Glorious Leader'
        image:
          type: ImageBlock
          url: /images/the-captain.jpg
          altText: Photo of Dubai Croquet Club Captain
      - quote: |
          “Theres nothing like the feeling of some real wood in your paws”
        name: George Clooney & Bradley Pitt
        title: Tequila salesman & buddy
        image:
          url: /images/george& brad.jpg
          altText: Two gentlemen playing croquet
        elementId: ''
        styles:
          name:
            fontWeight: 400
            fontStyle: normal
          title:
            fontWeight: 400
            fontStyle: normal
      - quote: |
          "We love croquet so much we dress up to discuss our game plan"
        name: Cate Blanchett & Leonado Di Caprio
        title: Undercover Austrailian & a tweed suit wearing friend
        image:
          type: ImageBlock
          url: /images/leo.jpg
          altText: Carla Rogers & Leo Di Caprio discussing their croquet strategy
    styles:
      self:
        height: auto
        width: wide
        margin:
          - mt-0
          - mb-0
        padding:
          - pt-28
          - pb-28
        justifyContent: center
      title:
        textAlign: center
      subtitle:
        textAlign: center
    type: TestimonialsSection
  - type: ContactSection
    colors: colors-f
    backgroundSize: inset
    title: Sign Up To Our Newsletter
    text: |
      Sign up now and keep in the loop about all our news.
    form:
      type: FormBlock
      variant: variant-b
      elementId: sign-up-form
      destination: newsletter@dubaicroquet.com
      action: /.netlify/functions/submission_created
      fields:
        - name: email
          label: Email
          hideLabel: true
          placeholder: Your email
          isRequired: true
          width: full
          type: EmailFormControl
      submitLabel: Sign Up
      styles:
        submitLabel:
          textAlign: center
    styles:
      self:
        height: auto
        width: wide
        margin:
          - mt-24
          - mb-0
          - ml-4
          - mr-4
        padding:
          - pt-24
          - pb-24
          - pr-4
          - pl-4
        alignItems: center
        justifyContent: center
        flexDirection: row
        borderRadius: xx-large
        boxShadow: xx-large
      title:
        textAlign: center
      text:
        textAlign: center
---
