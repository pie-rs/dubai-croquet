---
layout: PageLayout
title: Player Registration
sections:
  - type: ContactSection
    elementId: ''
    colors: colors-h
    backgroundSize: full
    title: 2023 Clements Cup Player Registration
    text: >
      You've limbered up. You look fine in white. You've sharpened your blades
      and your wit. You're so ready baby.


      You're signing up to play aren't you, you cheeky monkey?


      Go on, doooowit:
    form:
      type: FormBlock
      variant: variant-a
      elementId: contact-form
      action: /.netlify/functions/submission_created
      destination: hello@dubaicroquet.com
      fields:
        - type: TextFormControl
          name: Fighting Name
          label: Name
          placeholder: Fighting Name
          isRequired: true
          width: 1/2
        - type: EmailFormControl
          name: email
          label: Email
          placeholder: Your email
          isRequired: false
          width: 1/2
          hideLabel: false
        - type: SelectFormControl
          name: Identity
          label: Identity
          hideLabel: false
          defaultValue: Please choose...
          options:
            - Wannabe Captain
            - Player Baby
            - Lost in my own pronouns
          isRequired: true
          width: 1/2
        - type: TextFormControl
          name: Phone Number
          label: Phone Number
          hideLabel: false
          isRequired: true
          width: 1/2
          placeholder: +971xx
        - type: TextFormControl
          name: Team Name
          placeholder: Team Name
          isRequired: false
          width: 1/2
          hideLabel: false
          label: Team Name
        - type: TextFormControl
          name: Number of Players in your Team
          label: Number of Players in your Team
          hideLabel: false
          placeholder: Total number of players in your team
          isRequired: false
          width: 1/2
        - type: SelectFormControl
          name: Status
          label: Status
          hideLabel: false
          defaultValue: Please choose...
          options:
            - Married
            - Single
            - Dubai Single
          isRequired: false
          width: 1/2
        - type: CheckboxFormControl
          name: clubhouse attendance
          isRequired: false
          width: full
          label: >-
            Will you be attending for tea and cakes at the clubhouse after the
            battle?
        - type: TextareaFormControl
          name: Croquet Career
          label: Croquet Career
          hideLabel: false
          placeholder: A short essay describing your croquet career and sponsorship
          isRequired: false
          width: full
        - type: CheckboxFormControl
          name: updates
          label: Sign me up to receive updates
          isRequired: false
          width: full
      submitLabel: Submit Registration
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
          - pt-12
          - pb-12
          - pl-4
          - pr-4
        alignItems: center
        justifyContent: center
        flexDirection: row
      title:
        textAlign: left
      text:
        textAlign: left
  - type: TextSection
    colors: colors-a
    styles:
      self:
        height: auto
        width: wide
        margin:
          - mt-0
          - mb-12
          - ml-0
          - mr-0
        padding:
          - pt-12
          - pb-36
          - pl-4
          - pr-4
        justifyContent: center
      title:
        textAlign: left
      subtitle:
        textAlign: left
      text:
        textAlign: left
    text: >+
      1.  Yes you may attend and not play, however, you will be spurned and
      quite possibly smited


      2.  No white is not compulsory attire. Please refer to point one for
      summary judgement


      3.  No, you may not wear a captains hat, unless it's a good one


      4.  The rules are subject to change and may be made up as we go along


      5.  All services are subject to a no-knowledge fee of ZERO AED


      6.  If you are a national newspaper that rhymes with Dolph Hughes, could
      you reprint this list with confusing images in as complicated legalese as
      possible? You ThAnK


      7.  Still confused?  Drop us a WhatsApp snowflake, we've got you.

---
