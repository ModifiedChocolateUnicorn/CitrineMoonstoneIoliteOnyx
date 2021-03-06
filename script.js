var app = new Vue({
  el: '#app',
  created: function() {
    console.log('created main !');
    windowSize = window.innerWidth;
    this.author_name = windowSize > 1024 ? "Aaron Mello" : "Joe deSousa";
    this.author_picture_link = windowSize > 1024 ? "https://unsplash.com/photos/BdlDv9YychU" : "https://unsplash.com/photos/arKdO5cxaCk"


    window.fbAsyncInit = function() {
      FB.init({
        appId            : '1935977786623831',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10'
      });
      FB.AppEvents.logPageView();

      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          app.have_to_login = false;
        } else if(response.status === 'not_authorized') {
          app.have_to_login = true;
        }
      });

    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  },
  data: {
    chosen_lang: "EN",
    want_infos: false,
    title: 'PronounsAndAccordsMatter',
    message: 'This is a minimalist web application using the Facebook API so you can share a pronoun and an accord with your facebook friends.',
    info_button: 'Want some infos',
    infos_text: "Gender is a social construct. Things that people would consider as hints to guess/know someone's gender or the pronom they use like look, body, and such won't make you know ! You don't have to know the exact way someone identifies (their gender) and they don't even have to tell you if they don't want to, but use their pronoun and accord to respect them !",
    call_to_action_choice: 'Choose a pronom/ an accord to start !',
    call_to_action_connect: 'Click on the button below to connect to Facebook and use the app',
    call_to_action_share: 'Just click the button below and share your pronoun(s) and accord(s) with the people you know ;) !',
    p_subtitle: 'Pick your preferred pronoun',
    a_subtitle: 'Pick your preferred accord',
    have_to_login: '',
    pronouns: [
      'they',
      'ze',
      'he',
      'xe',
      'fae',
      'zie',
      'she',
      'ae',
      'per',
      'ey'
    ],
    accords: [
      'e',
      'é',
      'ae',
      's',
      'xe',
      'ø',
      'm'
    ],
    chosen_p: '',
    chosen_a: '',
    soc_net_feedback: '',
    author_name: '',
    author_picture_link: '',
    footer_code:'Coded by ',
    footer_pic:'Pictures by ',
    footer_more:'More Infos',

    // FR lang part //
    message_fr: "Application web minimaliste qui utilise l'API Facebook pour que vous partagiez votre pronom (et l'accord qui va avec) avec vos ami-es Facebook.",
    info_button_fr: 'Je veux bien quelques infos',
    infos_text_fr: "Le genre est une construction sociale. Des éléments tels qu'une apparence, un corps ou d'autres détails ne sont pas représentatifs du genre d'une personne ou du pronom que cette personne utilise. Vous n'êtes pas obligé-e de connaître le genre précis de la personne (celle ci n'a pas à vous le dire si elle n'en a pas envie d'ailleurs) mais pour respecter la personne, utilisez son pronom et son accord !",
    call_to_action_choice_fr:'Sélectionne un pronom/accord pour commencer !',
    call_to_action_connect_fr: "Appuie sur le bouton plus bas pour te connecter à Facebook et utiliser l'app",
    call_to_action_share_fr: "Un petit clic sur le bouton en contrebas pour partager ton pronom et ton accord avec tes connaissances ;) !",
    p_subtitle_fr: 'Choisis un pronom',
    a_subtitle_fr: 'Choisis un accord',
    pronouns_fr: [
      'iel',
      'ael',
      'elle',
      'ellui',
      'ielle',
      'ø',
      'ol',
      'ul',
      'il',
      'ae',
      'aelle',
      'al'
    ],
    footer_code_fr:'Codé par ',
    footer_pic_fr:'Photos par ',
    footer_more_fr:'Ressources'
  },
  methods: {

    //- GENERIC METHODS -//

    // this is taking care of updating want_infos
    doIWantInfos: function() {
      let want_infos = app.want_infos === true ? false : true;
      app.want_infos = want_infos;
    },

    //- FACEBOOK METHODS -//

    // ouvre une fenêtre de login FB pour accorder les permissions nécessaires à l'application
    logMeInWithPermissions: function() {
      FB.login(function(response) {
      }, {scope: 'publish_actions'});
      app.have_to_login = false;
    },
    // publie le pronom et accord choisi sur FB
    publishToFB: function() {
      // this checks wether the user is trying to be malicious and misuse the app (non approved pronouns/accords for example) //
      if (app.pronouns.includes(app.chosen_p) && app.accords.includes(app.chosen_a) || app.pronouns_fr.includes(app.chosen_p) && app.accords.includes(app.chosen_a)) {
        // defining the variable that'll be given to message when calling the FB api to POST the status //
        let fb_message = app.chosen_lang === 'EN' ? "My pronoun is " + app.chosen_p + " and my accord is " + app.chosen_a + ". They're important to me and being misgendered is hurtful so please, use them." : "J'utilise le pronom " + app.chosen_p + " et l'accord, " + app.chosen_a + ". C'est quelque chose d'important pour moi et vivre le mégenrage est très dur donc s'il vous plait, respectez les."
        FB.api(
          '/me/feed',
          'POST',
          {"message": fb_message },
          function(response) {
            if (response.id != undefined && response.id != '') {
              console.log(response.id);
              app.soc_net_feedback = app.chosen_lang === 'EN' ? "Status has been published successfully :) !" : "Le statut a bien été posté :) !";
            } else {
              app.soc_net_feedback = app.chosen_lang === 'EN' ? "A problem happened and the status wasn't published :( !" : "Il y a eu une erreur et le statut n'a pu être posté :( !";
            }
          }
        );
      }
      else {
        location.reload(true);
      }
    }
  }
})
