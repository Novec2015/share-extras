/**
 * Copyright (C) 2010-2012 Share Extras Contributors.
 */

/**
 * This is the "Prettify" plugin used to display documents using the google-code-prettify project.
 *
 * It supports any text-based format such as XML/HTML mark-up, source code and CSS that are supported
 * by google code prettify. See the prettify project site for more information.
 * 
 * @namespace Alfresco.WebPreview.prototype.Plugins
 * @class Alfresco.WebPreview.prototype.Plugins.Prettify
 * @author Will Abson
 */
(function()
{
   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;
   
   /**
    * Prettify web-preview plugin constructor
    *
    * @constructor
    * @param wp {Alfresco.WebPreview} The Alfresco.WebPreview instance that decides which plugin to use
    * @param attributes {Object} Arbitrary attributes brought in from the <plugin> element
    * @return {Alfresco.WebPreview.prototype.Plugins.Prettify} Plugin instance
    */
   Alfresco.WebPreview.prototype.Plugins.Prettify = function(wp, attributes)
   {
      this.wp = wp;
      this.attributes = YAHOO.lang.merge(Alfresco.util.deepCopy(this.attributes), attributes);
      return this;
   };
   
   Alfresco.WebPreview.prototype.Plugins.Prettify.prototype =
   {
      /**
       * Attributes
       */
      attributes:
      {
         /**
          * Language abbreviation code to force display of a specific language, e.g. 'lang-html'
          * 
          * If not specified (or empty) will use the normal prettify auto-detection
          * 
          * @property lang
          * @type String
          * @default ""
          */
         lang: ""
      },
   
      /**
       * Tests if the plugin can be used in the users browser.
       *
       * @method report
       * @return {String} Return nothing if the plugin may be used, otherwise returns a message containing the reason
       *         it can't be used as a string.
       * @public
       */
      report: function Prettify_report()
      {
         return (typeof(prettyPrint) == "function") ? null : "prettyPrint() not found!";
      },
   
      /**
       * Display the node.
       *
       * @method display
       * @public
       */
      display: function Prettify_display()
      {
         // Set to syncronous rendering, since async. code contains a bug which means it never executes
         window['PR_SHOULD_USE_CONTINUATION'] = false;
         
         Alfresco.util.Ajax.request({
            url: this.wp.getContentUrl(),
            successCallback: {
               fn: this.onContentLoaded,
               scope: this
            },
            failureMessage: this.wp.msg("error.contentLoadFailure")
         });
         
         // Return null means WebPreview instance will not overwrite the innerHTML of the preview area, which we want the callback to do
         return null;
      },
      
      /**
       * Handler for successful load of the content
       * 
       * @method onContentLoaded
       * @param @p_obj Response object from YUI Connection Manager
       * @public
       */
      onContentLoaded: function Prettify_onContentLoaded(p_obj)
      {
         var classes = 'prettyprint' + $html(this.attributes.lang ? ' ' + this.attributes.lang : '');
         this.wp.getPreviewerElement().innerHTML = '<pre class="' + classes + '">' + (p_obj.serverResponse.responseText).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
         prettyPrint();
      }
   };
})();