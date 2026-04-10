---
layout: PageLayout
title: FAQ
sections:
  - colors: colors-a
    elementId: ''
    title: Need Answers?
    items:
      - question: Can I become a multimillionaire playing croquet?
        answer: >
          Um. No. Probably not. But if you are one, its definitely the game to
          play.  Along with Elephant Polo. Also, who doesn't like throwing into
          the conversation that they are heading to 'my club'?
      - question: Is croquet hard to pick up?
        answer: |
          Seriously?  Have you seen our captain?
      - question: Is there a uniform?
        answer: >
          No of course not.  Wear whatever you feel comfortable in.


          As long as its white.  And linen. And Fabulous.


          We have personal shoppers and stylists available should you need some
          pointers.  Just have a (very) quiet word with the ladies' captain.
      - question: Is this club serious?
        answer: >
          Define serious?  We mostly all have jobs There are some children,
          plants and pets. They are all currently alive.
      - question: Where do you play?
        answer: >
          We are currently looking for a new home.


          We are open to anywhere with good grass, ground staff, a pool, a bar,
          air conditioning, parking, a sauna, a hammam, a jetty, a runway and an
          in-house band.
      - question: When can I play
        answer: >
          Hopefully soon! There are lots of ways to get involved.


          Checkout the [Events page](https://dubaicroquet.com/events/) for
          details of our next meeting.
      - question: Is it free to play?
        answer: >
          You are aware this is Dubai, right?


          Hey, we want this to be inclusive so generally if there is a charge it
          will be shared by us all just to cover costs.
      - question: 'I am a member of another croquet club, can I play?'
        answer: >
          The bar is low my friend. Be prepared to be flexible on the rules but
          all are welcome! Come show us how it's done.
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
          - pt-32
          - pb-12
          - pl-4
          - pr-4
        justifyContent: center
        borderRadius: none
        borderWidth: 0
        borderStyle: none
        borderColor: border-dark
      title:
        textAlign: left
      subtitle:
        fontWeight: '400'
        fontStyle: normal
        textAlign: left
      actions:
        justifyContent: flex-start
    type: FaqSection
  - type: ContactSection
    colors: colors-f
    backgroundSize: inset
    title: Join Our Mailing List
    text: |
      Sign up today to be kept up-to-date on all the latest croquet chit chat
    form:
      type: FormBlock
      variant: variant-b
      elementId: contact-form
      destination: newsletter@dubaicroquet.com
      action: /.netlify/functions/submission_created
      fields:
        - name: email
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
          - ml-0
          - mr-0
        padding:
          - pt-24
          - pb-24
          - pr-4
          - pl-4
        alignItems: center
        justifyContent: center
        flexDirection: row
        borderRadius: xx-large
        borderWidth: 0
        borderStyle: none
        borderColor: border-dark
      title:
        textAlign: center
      text:
        textAlign: center
---
