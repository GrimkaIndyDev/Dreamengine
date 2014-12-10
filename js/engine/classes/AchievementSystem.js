/**
* @author Inateno / http://inateno.com / http://dreamirl.com
*/
/**
 * provide a system to create achievements. Use events in the engine to detect unlockeds
 * @namespace AchievementSystem
 */
define( [ 'stash', 'DE.CONFIG', 'DE.about', 'DE.Event', 'DE.AudioManager'
        , 'DE.Notifications', 'DE.LangSystem', 'DE.SaveSystem' ],
function( stash, CONFIG, about, Event, AudioManager
        , Notifications, LangSystem, SaveSystem )
{
  // achievement-unlock added in dictionary
  var langs = {
    "en": "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% unlocked</div>"
    ,"fr": "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% débloqué</div>"
    ,"es": "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% desbloqueado</div>"
    ,"pt": "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% desbloqueado</div>"
    ,"de": "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% entriegelt</div>"
    ,"it": "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% sbloccato</div>"
    ,"ru": "<div class='ingame-achievement'><img src='%path%' alt='%name%' />%name% разблокирован</div>"
  };
  
  var AchievementSystem = new function()
  {
    this.DEName        = "AchievementSystem";
    this.achievements  = [];
    this.userAchievements = {};
    
    this.achievementsUrl = "img/achievements/";
    
    this.init = function( list, userAchievements )
    {
      for ( var i in langs )
      {
        if ( !LangSystem.dictionary[ i ] )
          continue;
        LangSystem.dictionary[ i ][ "achievement-unlock" ] = langs[ i ];
      }
      // SaveSystem.saveAchievements( {} ); // if you want clean your achievements
      this.achievements = [];
      for ( var i = 0, a; a = list[ i ]; ++i )
        this.achievements.push( a );
      this.userAchievements = userAchievements || SaveSystem.loadAchievements();
    };
    
    /**
     * when engine trigger an event "games-datas", checkEvent handle the name and value to
     * find a corresponding achievement
     * you shouldn't use this method directly and use the Event
     * @memberOf AchievementSystem
     * @protected
     * @param {String} eventName - event correspond to an objective
     * @param {params} value - your value
     * @example DE.trigger( "games-datas", "objective-name", myValue );
     */
    this.checkEvent = function( eventName, value )
    {
      for ( var i = 0, a, ua; a = this.achievements[ i ]; ++i )
      {
        ua = this.userAchievements[ a.namespace ];
        for ( var t in a.objectives )
        {
          if ( t != eventName || ( ua && ( ua.complete ||
              ( ua.objectives[ t ] && ua.objectives[ t ].complete ) ) ) )
            continue;
          this.updateValue( a, t, value );
        }
      }
      SaveSystem.saveAchievements( this.userAchievements );
    };
    
    /**
     * if you wanna check manually if an achievement is unlocked use this method
     * @memberOf AchievementSystem
     * @protected
     * @param {String} namespace - achievement namespace
     * @example if ( DE.AchievementSystem.isUnlock( "commander" ) )
     */
    this.isUnlock = function( namespace )
    {
      for ( var i = 0, a, ua; a = this.achievements[ i ]; ++i )
      {
        if ( a.namespace == namespace )
          return this.userAchievements[ namespace ] ? this.userAchievements[ namespace ].complete : false;
      }
    };
    
    this.updateValue = function( achievement, targetKey, value )
    {
      var objective = achievement.objectives[ targetKey ];
      if ( !this.userAchievements[ achievement.namespace ]
          || !this.userAchievements[ achievement.namespace ].objectives )
        this.userAchievements[ achievement.namespace ] = { objectives: {} };
      var uach = this.userAchievements[ achievement.namespace ];
      switch( objective.type )
      {
        case "increment":
          if ( !uach.objectives[ targetKey ] )
            uach.objectives[ targetKey ] = { "value": 0 };
          uach.objectives[ targetKey ].value += value || 1;
          break;
        default: // equal, >=
          uach.objectives[ targetKey ] = { "value": value };
          break;
      }
      this.checkUnlock( achievement );
    };
    
    this.checkUnlock = function( achievement )
    {
      var ua = this.userAchievements[ achievement.namespace ].objectives;
      var objectives = achievement.objectives;
      var achComplete = true, ob, obComplete;
      for ( var i in objectives )
      {
        if ( !ua[ i ] )
        {
          achComplete = false;
          continue;
        }
        if ( ua[ i ].complete )
          continue;
        ob = objectives[ i ];
        obComplete = true;
        switch( ob.type )
        {
          case "equal":
            if ( ob.target != ua[ i ].value )
              obComplete = false;
            break;
          case "increment":
          case ">=":
            if ( ob.target > ua[ i ].value )
              obComplete = false;
            break;
        }
        if ( obComplete )
          ua[ i ].complete = true;
        else
          achComplete = false;
      }
      
      if ( achComplete )
        this.unlocked( achievement );
    };
    
    this.unlocked = function( achievement )
    {
      this.userAchievements[ achievement.namespace ].complete = true;
      var name = achievement.names[ LangSystem.currentLang ] || achievement.names.en || "null";
      var url = this.achievementsUrl + achievement.namespace + ".png";
      var txt = ( LangSystem.get( "achievement-unlock" ) || "Set achievement unlock text please" ).replace( /%name%/gi, name )
        .replace( /%path%/gi, url );
      Notifications.create( txt, CONFIG.notifications.achievementUnlockDuration );
      AudioManager.fx.play( "achievement-unlocked" );
    };
    
    Event.on( "games-datas", this.checkEvent, this );
  };
  return AchievementSystem
} );