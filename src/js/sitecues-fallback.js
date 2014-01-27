(function(){

  'use strict';

  // In production the basepath will set before this script executes...
  if (!window.sitecues.fallbackBasePath) {
    // ...but you will need to set the basepath here when in development.
    window.sitecues.fallbackBasePath = '/sitecues-js-fallback/src/';
  }

  function getIEv() {
    // Returns the version of Internet Explorer or a -1
    // (indicating the use of another browser).
    var result = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer'){
      var userAgent = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(userAgent) != null){
        result = parseFloat( RegExp.$1 );
      }
    }

    return result;
  }

  function init(msg) {
    var head = document.getElementsByTagName('head').item(0),
        body = document.getElementsByTagName('body').item(0),
        fallback,
        sitecuesFallbackImage,
        mask,
        overlay,
        vertOffset,
        modal,
        messageHolder,
        logoHolder,
        contentHolder,
        btnHolder,
        btnDismiss,
        btnDismissInt,
        btnExplore,
        btnExploreInt,
        sitecuesLogo,
        sitecuesLogoLinkWrap,
        msg = msg,
        displayedMsg,
        msgContainer,
        badgeImage,
        IEv = getIEv(),
        badge = document.getElementById('sitecues-badge'),
        fallback = document.getElementById('sitecuesFallback');

    if (IEv > 0 && IEv <= 6) {
      importCSS(window.sitecues.fallbackBasePath + 'css/sitecues-fallback-lteie6.css')
    }

    if (badge === null){
      badge = createBadge();
      setBadgeStyle(badge);
    } else {
      badge.onclick = function(){
        toggleFallbackModal()
      }
    };

    if (fallback === null){
      fallback = createFallback();
    };

    function setBadgeStyle(badge){
      badgeImage = document.getElementById('sitecues-badge-image');

      body.style.position = 'relative';
      badge.style.cursor = 'pointer';
      /*
      Have to write out TRBL for IE6 as '!important'
      is only supported if it is the last
      declaration in a string
      */
      badge.style.margin.top = '0px !important';
      badge.style.margin.right = '0px !important';
      badge.style.margin.bottom = '0px !important';
      badge.style.margin.left = '0px !important';

      badge.style.padding.top = '0px !important';
      badge.style.padding.right = '0px !important';
      badge.style.padding.bottom = '0px !important';
      badge.style.padding.left = '0px !important';
      
      badge.style.border.top = '0px !important';
      badge.style.border.right = '0px !important';
      badge.style.border.bottom = '0px !important';
      badge.style.border.left = '0px !important';


      // badge.style.margin = '0px !important';
      // badge.style.padding = '0px !important';  
      // badge.style.border = '0px !important';

      //badge.style.outline = '0px !important';
      badge.style.position = ( (IEv >= 8) || (IEv == -1) ) ? 'fixed' : 'absolute';
      badge.style.top = '5px';
      badge.style.right = '20px';
      badge.style.zIndex = '2147483645';
          
      badge.style.width = '150px';
      badge.style.transition = 'opacity 500ms';
      badge.style.boxSizing = 'content-box';

      badgeImage.style.height = '25px';
      badgeImage.style.width = '134px';
      badgeImage.style.border = '2px solid #A3A3A3';
      badgeImage.style.padding = '4px';
      badgeImage.style.backgroundColor = 'white';
      badgeImage.style.borderRadius = '4px';
      badgeImage.style.boxShadow = '1px 1px 5px 0px rgba(10, 10, 10, .5)';
    }

    function createBadge(success){
      
      var badge = document.createElement('div');
      badge.id = 'sitecues-badge';

      badge.sitecuesFallbackImage = sitecuesFallbackImage = document.createElement('img');
      sitecuesFallbackImage.id = 'sitecues-badge-image';
      sitecuesFallbackImage.src = window.sitecues.fallbackBasePath + 'img/sitecues-fallback-badge.png';
      sitecuesFallbackImage.title = 'sitecues™ - fallback trigger.';
      sitecuesFallbackImage.alt = 'sitecues™ fallback trigger.';

      body.appendChild(badge);
      badge.appendChild(sitecuesFallbackImage);

      badge.onclick = function(){
        toggleFallbackModal();
      };

      return badge;
    };

    function createFallback(success) {

      /* load fallback styles */
      importCSS(window.sitecues.fallbackBasePath + 'css/sitecues-fallback.css');

      /* Background mask for fallback message */
      var fallback = mask = document.createElement('div');
          mask.id = 'sitecuesFallback';
          mask.className = 'close hide';
      
      body.appendChild(mask);

      fallback.overlay = overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.id = 'overlayMask';

      overlay.style.height = getDocHeight() + '200px';
        
      if ( (IEv == 6) || (IEv == 7) || (IEv == 8) ){
        overlay.style.height = getDocHeight();
        overlay.style.opacity = '0.5';
        overlay.style.filter = 'filter:alpha(opacity=50)';
        overlay.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)';
      }

      mask.appendChild(overlay);

      fallback.verticalOffset = vertOffset = document.createElement('div');
      vertOffset.className = 'vertical-offset';

      mask.appendChild(vertOffset);
      
      /* Modal div for fallback message */
      fallback.modal = modal = document.createElement('div');
      modal.id = 'sitecues-fallback-unsupported-browser';
      modal.className = 'plainBoxWrap';
      vertOffset.appendChild(modal);
      
      /* Used a table for the message */
      fallback.table = messageHolder = document.createElement('div');
      messageHolder.id = 'unsupported-browser-warning';
      modal.appendChild(messageHolder);

      fallback.contents = contentHolder = document.createElement('div');
      contentHolder.id = 'content-holder';

      fallback.buttons = btnHolder = document.createElement('div');
      fallback.buttonDismiss = btnDismiss = document.createElement('div');
      btnDismiss.id = 'dismiss-btn';
      fallback.buttonExplore = btnExplore = document.createElement('div');
      btnExplore.id = 'explore-btn';

      btnHolder.className = 'btn-group';

      messageHolder.appendChild(contentHolder);
            
      fallback.btn1 = btnDismissInt = document.createElement('a');
             
      btnDismissInt.type = 'button';
      btnDismissInt.className = 'btn btn-default';
      btnDismissInt.onclick = toggleFallbackModal;
      btnDismissInt.innerHTML = 'Dismiss';
                
      btnDismiss.appendChild(btnDismissInt);

      fallback.btn2 = btnExploreInt = document.createElement('a');
                
      btnExploreInt.type = 'button';
      btnExploreInt.className = 'btn btn-default';
      btnExploreInt.href = '//www.sitecues.com/compatibility.php';
      btnExploreInt.target = '_blank';
      btnExploreInt.innerHTML = 'Learn More';
            
      btnExplore.appendChild(btnExploreInt);

      /* left table column - sitecues logo area */
      fallback.logoHolder = logoHolder = document.createElement('div');
      logoHolder.id = 'sitecues-logo-holder';

      contentHolder.appendChild(logoHolder);

      /* Left sitecues logo image */
      fallback.sitecuesLogo = sitecuesLogo = document.createElement('img');
      sitecuesLogo.id = 'sitecues-unsupported-browser-img';
      sitecuesLogo.src = window.sitecues.fallbackBasePath + 'img/no-sitecues-support-warning.png';
      sitecuesLogo.title = 'sitecues™ - unsupported browser image.';
      sitecuesLogo.alt = 'Visit sitecues.com for more information.';
        
      /* Wrap the logo with an </a> for semantic html… */
      fallback.sitecuesLogoLinkWrap = sitecuesLogoLinkWrap = document.createElement('a');
      sitecuesLogoLinkWrap.className = 'logoWrapper';
      sitecuesLogoLinkWrap.href = '//www.sitecues.com/';
      sitecuesLogoLinkWrap.target = '_blank';

      logoHolder.appendChild(sitecuesLogoLinkWrap);
      sitecuesLogoLinkWrap.appendChild(sitecuesLogo);

      /* Right column - message area */
      fallback.messageContainer = msgContainer = document.createElement('div');
      msgContainer.id = 'warning-message';

      contentHolder.appendChild(msgContainer);

      fallback.displayedMsg = displayedMsg = '<h3>Our apologies!</h3><p>'+
        '<span><strong>sitecues&trade;</strong> zoom &amp; speech tools </span>'+
        '<span>'+msg+'</span>'+
        '</p>';

      msgContainer.innerHTML = displayedMsg;

      contentHolder.appendChild(btnHolder);

      btnHolder.appendChild(btnDismiss);
      btnHolder.appendChild(btnExplore);

      return fallback;
    };

    function importCSS(src) {
      var cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.type = 'text/css';
      cssLink.href = src;
      head.appendChild(cssLink);
    };

   }

  function toggleFallbackModal() {
    var e = document.getElementById('sitecuesFallback');
    
    if ((e.className.indexOf('active') > -1) ){
      e.className = 'close';
      /*
      Setting timeout before adding the "hide" class (display:none)
      This allows a CSS fade-out transition to complete (set to 250ms)
      before completely hiding the element.
      */
      window.setTimeout(function Remove() {
        /* Adds {display:none} */
        e.className = 'close hide';
      },500);

    } else {

        e.className = 'active';
    }
  }

  function getDocHeight() {
    var D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    )
  };    
  
  init('require a more current version of your web browser.');

})();