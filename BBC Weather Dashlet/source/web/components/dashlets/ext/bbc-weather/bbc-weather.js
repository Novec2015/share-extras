/**
 * Copyright (C) 2005-2009 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing
 */
 
/**
 * Dashboard Poll component.
 * 
 * @namespace Alfresco
 * @class Alfresco.dashlet.BBCWeather
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML,
      $combine = Alfresco.util.combinePaths;

   /**
    * Preferences
    */
   var PREFERENCES_DASHLET = "org.alfresco.share.dashlet",
      PREF_SITE_TAGS_FILTER = PREFERENCES_DASHLET + ".BBCWeatherFilter";


   /**
    * Dashboard BBCWeather constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.dashlet.BBCWeather} The new component instance
    * @constructor
    */
   Alfresco.dashlet.BBCWeather = function BBCWeather_constructor(htmlId)
   {
      return Alfresco.dashlet.BBCWeather.superclass.constructor.call(this, "Alfresco.dashlet.BBCWeather", htmlId);
   };

   /**
    * Extend from Alfresco.component.Base and add class implementation
    */
   YAHOO.extend(Alfresco.dashlet.BBCWeather, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * The component id.
          *
          * @property componentId
          * @type string
          */
         componentId: "",
      
         /**
          * The location ID of the forecast to show
          *
          * @property location
          * @type number
          * @default 0
          */
         location: 0,

         /**
          * ID of the current site
          * 
          * @property siteId
          * @type string
          * @default ""
          */
         siteId: ""
      },

      /**
       * Dashlet title DOM container.
       * 
       * @property title
       * @type object
       */
      title: null,

      /**
       * Dashlet body DOM container.
       * 
       * @property body
       * @type object
       */
      body: null,

      /**
       * Fired by YUI when parent element is available for scripting
       * @method onReady
       */
      onReady: function BBCWeather_onReady()
      {
         Event.addListener(this.id + "-configure-link", "click", this.onConfigClick, this, true);
         
         // The dashlet title container
         this.title = Dom.get(this.id + "-title");

         // The dashlet body container
         this.body = Dom.get(this.id + "-body");
         
         // Load the data
         this.refreshData();
      },

      /**
       * Load the weather data using an AJAX call
       * @method refreshTimeline
       */
      refreshData: function BBCWeather_refreshData()
      {
         // Load the user timeline
         Alfresco.util.Ajax.request(
         {
            url: Alfresco.constants.URL_SERVICECONTEXT + "components/dashlets/bbc-weather/data",
            dataObj:
            {
               location: this.options.location
            },
            successCallback:
            {
               fn: this.onDataLoaded,
               scope: this,
               obj: null
            },
            failureCallback:
            {
               fn: this.onDataLoadFailed,
               scope: this
            },
            scope: this,
            noReloadOnAuthFailure: true
         });
      },
      
      /**
       * Data loaded successfully
       * @method onDataLoaded
       * @param p_response {object} Response object from request
       */
      onDataLoaded: function BBCWeather_onDataLoaded(p_response, p_obj)
      {
         this.body.innerHTML = p_response.serverResponse.responseText;
         this.title.innerHTML = this.msg("weather.title", this.options.location);
      },

      /**
       * Data load failed
       * @method onDataLoadFailed
       */
      onDataLoadFailed: function BBCWeather_onDataLoadFailed()
      {
         this.body.innerHTML = '<div class="detail-list-item first-item last-item">' + this.msg("label.error") + '</div>';
      },

      /**
       * YUI WIDGET EVENT HANDLERS
       * Handlers for standard events fired from YUI widgets, e.g. "click"
       */
      
      /**
       * Configuration click handler
       *
       * @method onConfigPollClick
       * @param e {object} HTML event
       */
      onConfigClick: function BBCWeather_onConfigPollClick(e)
      {
         var actionUrl = Alfresco.constants.URL_SERVICECONTEXT + "modules/dashlet/config/" + encodeURIComponent(this.options.componentId);
         
         Event.stopEvent(e);
         
         if (!this.configDialog)
         {
            this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog").setOptions(
            {
               width: "50em",
               templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/dashlets/bbc-weather/config",
               actionUrl: actionUrl,
               onSuccess:
               {
                  fn: function BBCWeather_onConfig_callback(e)
                  {
                     // Refresh the data
                     var loc = Dom.get(this.configDialog.id + "-location").value;
                     this.options.location = loc;
                     this.refreshData();
                  },
                  scope: this
               },
               doSetupFormsValidation:
               {
                  fn: function BBCWeather_doSetupForm_callback(form)
                  {
                     var select = Dom.get(this.configDialog.id + "-location");
                     if (select != null)
                     {
                        select.value = this.options.location;
                     }
                  },
                  scope: this
               }
            });
         }
         else
         {
            this.configDialog.setOptions(
            {
               actionUrl: actionUrl
            });
         }
         
         this.configDialog.show();
      }
   });
})();
