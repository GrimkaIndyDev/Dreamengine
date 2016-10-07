﻿/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Vector2
 * @class so, this is strange I assume, there is a z.<br>
 * But this z isn't a real axis, it's usefull to make a fake 3D scale on objects and<br>
 * ordering GameObject by z + z-index (order is important, lower z will be under higher z of course)<br>
 * So it's a Vector2 because you can't rotate or do anything on z axe, z is totally optional<br>
 * (of course, you can produce really nice effects with z, by calculating collisions along z axis, you should be able to do a nice Street of Rage like)
 * @example var pos = new DE.Vector2( 150, 100 );
 * @param {Float} [x=0]
 * @param {Float} [y=0]
 * @param {Float} [z=0]
 */
define( [ 'PIXI', 'DE.Time', 'DE.CONFIG' ],
function( PIXI, Time, CONFIG )
{
  var _PI = Math.PI;
  function Vector2( x, y, z )
  {
    PIXI.Point.call( this );
    
    this.gameObject = null;
    
    /**
     * @public
     * @memberOf Vector2
     * @type {Float}
     */
    this.x = x || 0;
    /**
     * @public
     * @memberOf Vector2
     * @type {Float}
     */
    this.y = y || 0;
    /**
     * @public
     * @memberOf Vector2
     * @type {Float}
     */
    this.z = z || 0;
    /**
     * current rotation, between 0 and 2PI
     * @public
     * @memberOf Vector2
     * @type {Float}
     */
    this.rotation = 0;
    
    /**
     * store cosinus
     * @private
     * @memberOf Vector2
     * @type {Float}
     */
    var _cosAngle = 1;
    /**
     * store sinus
     * @private
     * @memberOf Vector2
     * @type {Float}
     */
    var _sinAngle = 0;
    
    /**
     * set precise rotation
     * @public
     * @memberOf Vector2
     * @param {Float} newAngle
     * @returns {Float} this.rotation current rotation
     */
    this.setRotation = function( newAngle )
    {
      this.rotation = newAngle % ( _PI * 2 );
      
      if ( this.rotation == 0 )
      {
        _sinAngle = 0;
        _cosAngle = 1;
      }
      else
      {
        _sinAngle = Math.sin( this.rotation );
        _cosAngle = Math.cos( this.rotation );
      }
      
      if ( this.gameObject )
        this.gameObject._updateRotation();
      return this.rotation;
    }
    
    /**
     * apply the given angle to rotation
     * @public
     * @memberOf Vector2
     * @param {Float} angle rotation value
     * @param {Boolean} [ignoreDelta] if you want to prevent deltaTime adjustment
     * @returns {Float} this.rotation current rotation
     */
    this.rotate = function( angle, ignoreDelta )
    {
      if ( ignoreDelta )
        return this.setRotation( this.rotation + angle );
      return this.setRotation( this.rotation + ( angle * Time.deltaTime ) );
    }
    
    /**
     * multiply this vector with coef
     * @public
     * @memberOf Vector2
     * @param {Float} coef
     * @returns {Vector2} this current instance
     */
    this.multiply = function( coef )
    {
      this.x *= coef;
      this.y *= coef;
      return this;
    }
    
    /**
     * move position along the given Vector2
     * @public
     * @memberOf Vector2
     * @param {Vector2} vector2 vector to translate along
     * @param {Boolean} absolute if absolute, translation will ignore current rotation
     * @param {Boolean} [ignoreDelta] if you want to prevent deltaTime adjustment
     * @returns {Vector2} this current instance
     */
    this.translate = function( vector2, absolute, ignoreDelta )
    {
      if ( ( !vector2.x && vector2.x != 0 ) || ( !vector2.y && vector2.y != 0 ) )
        throw new Error( vector2 + " is not a Vector2" );
      
      if ( !ignoreDelta )
      {
        vector2 = {
          x : ( vector2.x * Time.deltaTime )
          ,y: ( vector2.y * Time.deltaTime )
        };
      }
      
      if ( !absolute )
      {
        if ( this.rotation == 0 )
        {
          this.x += vector2.x;
          this.y += vector2.y;
        }
        else
        {
          this.x -= -vector2.x * _cosAngle + vector2.y * _sinAngle;
          this.y -= -vector2.x * _sinAngle + vector2.y * -_cosAngle;
        }
      }
      else
      {
        this.x += vector2.x;
        this.y += vector2.y;
      }
      return this;
    }
    
    /**
     * change the vector length to 1 (check wikipedia normalize if you want know more about)
     * @public
     * @memberOf Vector2
     * @returns {Vector2} this current instance
     */
    this.normalize = function()
    {
      if ( this.x == 0 && this.y == 0 )
      {
        this.x = 0;
        this.y = 0;
        return this;
      }
      var len = Math.sqrt( this.x * this.x + this.y * this.y );
      this.x = this.x / len;
      this.y = this.y / len;
      return this;
    }
    
    /**
     * return the Vector between two Vector2
     * @public
     * @memberOf Vector2
     * @param {Vector2} a first vector2
     * @param {Vector2} b second vector2
     * @returns {Vector2} this current instance
     */
    this.getVector = function( a, b )
    {
      if ( (!a.x && a.x != 0) || (!a.y && a.y != 0)
        || (!b.x && b.x != 0) || (!b.y && b.y != 0) )
        throw new Error( "Vector2 need two Vector2 to return getVector" );
      
      this.x = b.x - a.x;
      this.y = b.y - a.y;
      return this;
    }
    
    /**
     * return the angle from a vector usefull for moves / translations without rotation
     * @public
     * @memberOf Vector2
     * @param {Vector2} vector2
     * @returns {Float} radians value
     */
    this.getVectorAngle = function( vector2 )
    {
      return ( Math.atan2( vector2.y, vector2.x ) + Math.PI * 0.5 ) % ( Math.PI * 2 );
    };
    
    /**
     * return the dotProduct between two Vector<br>
     * See wikipedia dot product for more informations
     * @public
     * @memberOf Vector2
     * @param {Vector2} a first vector2
     * @param {Vector2} b second vector2
     * @returns {Float} dotProduct result
     */
    this.dotProduct = function( a, b )
    {    
      if ( !a.x || !a.y )
        throw new Error( "Vector2 need two Vector2 to return dotProduct" );
      if ( b && b.x )
        return a.x * b.x + a.y * b.y;
      return this.x * a.x + this.y * a.y;
    }
    
    /**
     * return the angle (radians) between two vector2
     * @public
     * @memberOf Vector2
     * @param {Vector2} a first vector2
     * @param {Vector2} b second vector2
     * @returns {Float} angle result
     */
    this.getAngle = function( a, b )
    {
      if ( !b )
        b = this;
      return Math.atan2( a.y - b.y, a.x - b.x );
    }
    
    this.wtfAngle = function( a, b )
    {
      var tmp_vectorB = null;
      if ( b && b.x )
        tmp_vectorB = new Vector2( b.x, b.y ).normalize();
      else
        tmp_vectorB = new Vector2( this.x, this.y ).normalize();
      var tmp_vectorA = new Vector2( a.x, a.y ).normalize();
      return Math.acos( tmp_vectorA.dotProduct( tmp_vectorB ) );
    }
    
    /**
     * return real pixel distance with an other Vector2
     * @public
     * @memberOf Vector2
     * @param {Vector2} other
     * @returns {Int} distance result
     */
    /****
     * getDistance@Int( other@Vector2 )
     */
    this.getDistance = function( other )
    {
      var x = this.x - other.x;
        x *= x;
      var y = this.y - other.y;
        y *= y;
      return Math.sqrt( x + y ) >> 0;
    }
    
    /**
     * trigger a circle collision with an other Vector and a range
     * @public
     * @memberOf Vector2
     * @param {Vector2} other
     * @param {Float} range
     * @returns {Boolean} isInRange result
     */
    this.isInRangeFrom = function( other, range )
    {
      range *= range;
      var x = this.x - other.x;
        x *= x;
      var y = this.y - other.y;
        y *= y;
      var dist = x + y;
      if ( dist <= range )
        return true;
      return false;
    }
    
    /**
     * return the harmonics value<br>
     * can pass a rotation to get harmonics with this rotation
     * @public
     * @memberOf Vector2
     * @param {Float} [rotation] used by gameObjects in getPos and other
     * @returns {Harmonics} harmonics (cosinus and sinus)
     */
    this.getHarmonics = function( rotation )
    {
      if ( rotation )
        return { cos: Math.cos( rotation + this.rotation )
        , sin: Math.sin( rotation + this.rotation ) };
      return { 'cos': _cosAngle, 'sin': _sinAngle };
    }
    
    return this;
  }
  
  Vector2.prototype = Object.create( PIXI.Point.prototype );
  Vector2.prototype.constructor = Vector2;
  
  Object.defineProperties( Vector2.prototype, {
    z: {
      get: function()
      {
        return this._z || 0;
      }
      , set: function( value )
      {
        this._z = value;
        if ( this.gameObject )
        {
          this.gameObject._updateZScale();
          this.gameObject.sortChildren();
        }
      }
    }
  } );
  
  /**
   * set precise position
   * @public
   * @memberOf Vector2
   * @param {Vector2|Float} Vector2 or x
   * @returns {Vector2} this current instance
   */
  Vector2.prototype.setPosition = function( first, y, z )
  {
    if ( first.x !== undefined || first.y !== undefined )
    {
      this.x = first.x != undefined ? first.x : this.x;
      this.y = first.y != undefined ? first.y : this.y;
      this.z = first.z != undefined ? first.z : this.z;
      return this;
    }
    this.x = first != undefined ? first : this.x;
    this.y = y != undefined ? y : this.y;
    this.z = z != undefined ? z : this.z;
    return this;
  };
  Vector2.prototype.set = Vector2.prototype.setPosition;
  
  Vector2.prototype.clone = function()
  {
      return new Vector2( this.x, this.y, this._z );
  };
  
  Vector2.prototype.DEName = "Vector2";
  
  CONFIG.debug.log( "Vector2 loaded", 3 );
  return Vector2;
} );