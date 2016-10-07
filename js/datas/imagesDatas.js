﻿/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* imagesList
this is the imagesList will be available in the project.
Please declare in the same way than this example.
To load image as default just set "load" to true.
Otherwhise you can load/add images when you want, load images by calling the DREAM_ENGINE.ImageManager.pushImage function

- [ name, url, extension, 
parameters: load:Bool, totalFrame:Int, totalLine:Int, eachAnim:Int (ms), isAnimated:Bool, isReversed:Bool
] -

All parameters are optionnal but at least an empty object need to be set
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var datas = {
    // avalaible images sizes (engine will load optimisest images depends on user resolution)
    screenSizes: [
      { "w": 1920, "h": 1080, "path": "" }
      // ,{ "w": 1280, "h": 720, "path": "", "notRatio": true }
      // , { "w": 640, "h": 360, "path": "", "notRatio": true }
      // , { "w": 480, "h": 270, "path": "sd/" }
    ]
    
    // index of the used screen size during game conception
    , conceptionSizeIndex: 0
    
    // images folder name 
    , baseUrl: "img/"
    
    // usage name, real name (can contain subpath), extension, parameters
    , pools: {
      main: [
        // [ "example", "example", "png", { "totalFrame": 4, "totalLine": 2, "eachAnim": 50, "isAnimated":true, "isReversed": false } ]
        // [ "ship", "ayera/ship.png", { "totalFrame": 10, "totalLine": 1, "eachAnim": 100, "isAnimated":true, "isReversed": false } ]
        [ "reactor", "ayera/reactor.png", { "totalFrame": 4, "eachAnim": 40, "isAnimated":true, "isReversed": false } ]
        ,[ "bg", "platform.png", { "totalFrame": 1, "isAnimated":false, "isReversed": false } ]
        
        ,[ "canyon", "ayera/canyon.png", { "totalFrame": 1, "isAnimated":false, "isReversed": false } ]
        ,[ "grass", "ayera/grass.png", { "totalFrame": 1, "isAnimated":false, "isReversed": false } ]
        ,[ "touchControlBackground", "touchControlBackground.png", { "totalFrame": 1, "isAnimated": false } ]
        ,[ "touchControlStick", "touchControlStick.png", { "totalFrame": 1, "isAnimated": false } ]
        
        ,[ "platform", "platform.png", { "totalFrame": 1, "eachAnim": 1, "totalLine": 1, "isAnimated":false } ]
        
        ,"pck/ship.json"
      ]
      
      ,afterMain: [
        // resources
      ]
      
      ,hallOfFame: [
        // resources
      ]
    }
  };
  
  CONFIG.debug.log( "imagesDatas loaded", 3 );
  return datas;
} );