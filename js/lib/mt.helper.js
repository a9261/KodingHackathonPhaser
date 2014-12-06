/*
 * License: MIT http://opensource.org/licenses/MIT
 * do not edit this file directly - as it will get updated automatically width MightyEditor update
 */
(function(global){
	"use strict";
	var data = null;
	var global = window;
	if(global.mt && global.mt.data){
		data = global.mt.data;
	}
	
	global.mt = {
		
		SPRITE: 0,
		GROUP: 1,
		TEXT: 2,
		TILE_LAYER: 3,
		
		knownFonts: [
			"Arial",
			"Comic Sans MS",
			"Courier New",
			"Georgia",
			"Impact",
			"Times New Roman",
			"Trebuchet MS",
			"Verdana"
		],
 
		assets: {},
		objects: {},
	
		assetsPath: "assets",
		game: null,
	
		data: data,
		mainMovie: "__main",
		autoLoadFonts: true,
		
		init: function(game){
			this.game = game;
			this.game.load.crossOrigin = "anonymous";
			this.game.load.script("hacks", "js/lib/phaserHacks.js");
		},
 
		setBackgroundColor: function(appendToBody){
			
			if(this.data.map.backgroundColor){
				var tmp = this.data.map.backgroundColor.substring(1);
				var bg = parseInt(tmp, 16);
				
				if(this.game.stage.backgroundColor != bg){
					this.game.stage.setBackgroundColor(bg);
				}
			}
			
			if(appendToBody){
				document.body.style.backgroundColor = this.data.map.backgroundColor;
			}
		},
 
		// preload all assets
		preload: function(){
			this._loadAssets(this.data.assets.contents, this.assets, "");
		},
		
		// load assets for seperate object group
		loadGroup: function(name){
			var toLoad = {};
			var group = this.getObjectGroupByName(name);
			if(!group){
				console.error("failed to load group: ", name);
				return;
			}
			this._collectAssets(group, toLoad);
			this._loadAssetBuffer(toLoad);
		},
		
		// create full map
		createAll: function(){
			var all = {};
			this._loadObjects(this.data.objects.contents, this.game.world, "", all, true);
			
			for(var i in all){
				this.createTweens(all[i], this.mainMovie);
			}
			
			return all;
		},
		
		createTweens: function(phaserObject, name){
			var movie, movies, mdata;
			var obj = phaserObject.mt;
			obj.movies = {};
			
			movies = obj.movies;
			mdata = obj.data.movies;
			if(name == void(0)){
				for(var mov in mdata){
					if(mov == this.mainMovie){
						continue;
					}
					movies[mov] = new TweenCollection(mov, obj);
				}
			}
			else{
				movies[name] = new TweenCollection(name, obj);
			}
		},
		
		// create seperate group
		create: function(name, parent){
			parent = parent || this.game.world;
			var data = this.getObjectGroupByName(name);
			if(!data){
				console.error("failed to find the object: ", name);
				return;
			}
			
			return this._add(data, parent, "");
		},
		
		createGroup: function(name, parent){
			console.warn('mt.createGroup is deprecated. Use mt.create("'+name+'") instead');
			return mt.create(name, parent);
		},
		
		// create slope map for tilelayer
		createSlopeMap: function(layer){
			var map = {};
			var data = layer.layer.data;
			var i=0, j=0;
			
			for( ;i<data.length; i++){
				for(j=0; j<data[i].length; j++){
					if(data[i][j].index > 0){
						map[i*data[i].length + j] = data[i][j].index;
					}
				}
			}
			return map;
		},
		
		
		_mkDiff: function(o1, o2, flip){
			var out = {};
			for(var i in o1){
				if(i == "keyframe"){
					continue;
				}
				if(typeof o1[i] === "object"){
					continue;
				}
				if(o1[i] === void(0)){
					continue;
				}
				if(o1[i] != o2[i]){
					if(i == "angle"){
						out[i] = o2[i] - o1[i] + "";
					}
					else{
						out[i] = o2[i];
					}
				}
			}
			for(var i in o2){
				if(i == "keyframe"){
					continue;
				}
				if(typeof o2[i] === "object"){
					continue;
				}
				if(o1[i] === void(0)){
					continue;
				}
				if(o1[i] != o2[i]){
					if(i == "angle"){
						out[i] = o2[i] - o1[i] + "";
					}
					else{
						out[i] = o2[i];
					}
				}
			}
			return out;
		},

		getObjectData: function(name, container){
			if(typeof name == "object"){
				name = name.name;
			}
			
			container = container || this.data.objects;
			
			if(container.contents){
				for(var i=0; i<container.contents.length; i++){
					if(container.contents[i].contents){
						this.getObjectData(name, container.contents[i]);
					}
					else{
						if(container.contents[i].name == name){
							return container.contents[i];
						}
					}
				}
			}
			if(container.name == name){
				return container;
			}
		},
 
		getAssetPath: function(asset){
			return this.assetsPath + asset.fullPath;
		},
		
		getObjectGroupByName: function(name, container){
			container = container || this.data.objects.contents;
			var ret;
			for(var i = 0; i < container.length; i++){
				if(container[i].name == name){
					return container[i];
				}
				if(container[i].contents){
					ret = this.getObjectGroupByName(name, container[i].contents);
					if(ret){
						return ret;
					}
				}
			}
		},
		
		getAssetByName: function(name, container){
			container = container || this.data.assets.contents;
			for(var i in container){
				if(container[i].name == name){
					return container[i];
				}
				if(container[i].contents){
					ret = this.getAssetById(id, container[i].contents);
					if(ret){
						return ret;
					}
				}
			}
			
			return ret;
		},
		
		getAssetById: function(id, container){
			container = container || this.data.assets.contents;
			var ret = null;
			
			for(var i in container){
				if(container[i].id == id){
					return container[i];
				}
				if(container[i].contents){
					ret = this.getAssetById(id, container[i].contents);
					if(ret){
						return ret;
					}
				}
			}
			
			return ret;
		},
		
		getObjectByName: function(name, container){
			container = container || this.data.objects.contents;
			for(var i in container){
				if(container[i].name == name){
					return container[i];
				}
				if(container[i].contents){
					ret = this.getObjectById(id, container[i].contents);
					if(ret){
						return ret;
					}
				}
			}
			
			return ret;
		},
 
		isKnownFontFamily: function(font){
			for(var i=0; i<this.knownFonts.length; i++){
				if(this.knownFonts[i] == font){
					return true;
				}
			}
			return false;
		},
		
		loadFont: function(font, cb){
			
			var fontUrl = font.replace(/ /gi, "+");
			var link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("type", "text/css");
			
			var span = document.createElement("span");
			span.style.position = "absolute";
			span.style.top = span.style.left = 0;
			span.style.zIndex = -1;
			
			span.style.fontFamily = font;
			span.innerHTML = "ignore moi";
			span.style.visibility = "hidden";
			document.body.appendChild(span);
			
			link.onload = function(e){
				
				window.setTimeout(function(){
					document.body.removeChild(span);
				}, 1000);
				window.setTimeout(function(){
					cb(font);
				}, 300);
			};
			
			link.href="//fonts.googleapis.com/css?family="+fontUrl;
			
			document.head.appendChild(link);
		},
		
		getFontFamily: function(font){
			if(!this.autoLoadFonts){
				return;
			}
			var span = document.createElement("span");
			span.style.font = font;
			
			var fontFamily = span.style.fontFamily.replace(/'/gi, '');
			
			if(this.isKnownFontFamily(fontFamily)){
				return;
			}
			var that = this;
			this._fontsToLoad++;
			this.loadFont(fontFamily, function(){
				that._fontsToLoad--;
				
				if(that._fontsToLoad == 0){
					//clean up height cache
					PIXI.Text.heightCache = {};
					that._markDirty();
				}
			});
			return;
		},
		
		physics: {
			ninja: {
				enableTileLayer: function (layer) {
					layer = layer.layer;
					for (var y = 0, h = layer.height; y < h; y++){
						for (var x = 0, w = layer.width; x < w; x++){
							var tile = layer.data[y][x];
							if (tile && tile.index > 0){
								var body = new Phaser.Physics.Ninja.Body(this, null, 3, tile.index, 0, tile.worldX + tile.centerX, tile.worldY + tile.centerY, tile.width, tile.height);
								layer.bodies.push(body);
							}
						}
					}
					return layer.bodies;
				}
			}
		},
 
 
		/* private stuff */
		_fontsToLoad: 0,
		_loadAssetBuffer: function(buffer){
			var container;
			var asset = null;
			for(var i in buffer){
				asset = buffer[i];
				
				container = this._getAssetContainer(asset);
				this._addAsset(asset, container);
			}
		},
 
		_getAssetContainer: function(asset){
			var cont = this.assets;
			var path = asset.fullPath.split("/");
			path.shift();
			for(var i=0; i<path.length-1; i++){
				cont[path[i]] = cont[path[i]] || {};
				cont = cont[path[i]];
			}
			return cont;
		},
 
		_getObjectContainer: function(object){
			var cont = this.assets;
			var path = asset.fullPath.split("/");
			path.shift();
			for(var i=0; i<path.length-1; i++){
				cont[path[i]] = cont[path[i]] || {};
				cont = cont[path[i]];
			}
			return cont;
		},
 
		_collectAssets: function(group, buffer){
			var id, object, asset;
			for(var i=0; i<group.contents.length; i++){
				object = group.contents[i];
				if(object.contents){
					this._collectAssets(object, buffer);
				}
				id = object.assetId;
				asset = this.getAssetById(id);
				if(asset){
					buffer[id] = asset;
				}
			}
		},
 
		_loadAssets: function(data, container){
			var asset = null;
			
			for(var i = 0, l = data.length; i<l; i++){
				asset = data[i];
				if(asset.contents && asset.contents.length){
					if(container[asset.name] === void(0)){
						container[asset.name] = {};
					}
					this._loadAssets(asset.contents, container[asset.name]);
				}
				else{
					this._addAsset(asset, container);
				}
			}
		},
	
		_addAsset: function(asset, container){
			var path = this.assetsPath + asset.fullPath;
			var that = this;
			if(!asset.key){
				return;
			}
			
			// is already loaded ?
			if(container[asset.name]){
				return;
			}
			
			if(asset.atlas){
				this.game.load.atlas(asset.key, this.assetsPath + asset.fullPath, this.assetsPath + "/" + asset.atlas, null,  asset.type);
			}
			else if(asset.width != asset.frameWidth || asset.height != asset.frameHeight){
				this.game.load.spritesheet(asset.key, this.assetsPath + asset.fullPath, asset.frameWidth, asset.frameHeight, asset.frameMax, asset.margin, asset.spacing);
			}
			else{
				this.game.load.image(asset.key, this.assetsPath + asset.fullPath);
			}
			
			
			Object.defineProperty(container, asset.name, {
				get : function(){ 
					return asset;
				},
				enumerable: true
			});
			
		},
		
		_loadObjects: function(children, parent, path, ref, keepVisibility){
			parent = parent || this.game.world;
			path = path !== "" ? "." + path : path;
			
			for(var i = children.length - 1; i > -1; i--){
				ref[children[i].name] = this._add(children[i], parent, path, keepVisibility);
			}
		},
		
		_add: function(data, parent, path, keepVisibility){
			var createdObject = null;
			
			if(data.type == this.GROUP){
				createdObject = this._addGroup(data);
				
				if(data.physics && data.physics.enable){
					createdObject.enableBody = true;
				}
				parent.add(createdObject);
				
				createdObject.mt = {
					self: createdObject,
					data: data,
					children: {}
				};
				
				this._updateCommonProperties(data, createdObject, keepVisibility);
				this._loadObjects(data.contents, createdObject, path + data.name, createdObject.mt.children, keepVisibility);
			}
			else{
				if(data.type == this.TEXT){
					createdObject = this._addText(data, parent);
				}
				else if(data.type == this.TILE_LAYER){
					createdObject = this._addTileLayer(data, parent);
					if(data.physics && data.physics.enable){
						createdObject.map.setCollisionByExclusion([-1]);
					}
				}
				else{
					createdObject = this._addObject(data, parent);
					
					this.addPhysics(data, createdObject, (parent.mt ? parent.mt.data : null));
				}
				
				this._updateCommonProperties(data, createdObject, keepVisibility);
				
				createdObject.mt = {
					self: createdObject,
					data: data,
					children: {}
				};
				
				if(data.contents){
					this._loadObjects(data.contents, createdObject, path + data.name, createdObject.mt.children, keepVisibility);
				}
			}
			
			createdObject.self = createdObject;
			createdObject.getData = function(){
				return this.mt.data;
			};
			return createdObject;
		},
		
		addPhysics: function(tpl, sprite, parent){
			var p = tpl.physics;
			if(!p || !p.enable){
				if(parent && parent.physics && parent.physics.enable){
					p = parent.physics;
				}
			}
			if(p && p.enable){
				this.game.physics.arcade.enable(sprite);
				
				sprite.body.allowGravity = p.gravity.allow;
				sprite.body.gravity.x = p.gravity.x;
				sprite.body.gravity.y = p.gravity.y;
				
				sprite.body.immovable = p.immovable;
				
				sprite.body.bounce = p.bounce;
				
				sprite.body.maxAngular = p.rotation.maxAngular;
				sprite.body.allowRotation = p.rotation.allowRotation;
				
				sprite.body.maxVelocity = p.maxVelocity;
				
				sprite.body.mass = p.mass;
				sprite.body.collideWorldBounds = p.collideWorldBounds;
				
				var w = sprite.width;
				var h = sprite.height;
				if(p.size.width > 0){
					w = p.size.width;
				}
				if(p.size.height > 0){
					h = p.size.height;
				}
				
				sprite.body.setSize(w, h, p.size.offsetX, p.size.offsetY);
			}
		},
 
		_addGroup: function(object){
			var group = this.game.add.group();

			group.x = object.x;
			group.y = object.y;
			group.fixedToCamera = !!object.fixedToCamera;
			
			if(object.angle){
				group.angle = object.angle;
			}
			group.alpha = object.alpha || 1;
			
			return group;
		},
		
		_addText: function(object, group){
			this.getFontFamily(object.style.font);
			
			group = group || this.game.world;
			var t = this.game.add.text(object.x, object.y, object.text || object.name, object.style);
			group.add(t);
			return t;
		},
		
		_addTileLayer: function(object, group){
			group = group || this.game.world;
			var map = this.game.add.tilemap(null, object.tileWidth, object.tileHeight, object.widthInTiles, object.heightInTiles);
			
			var tl = map.createBlankLayer(object.name, object.widthInTiles, object.heightInTiles, object.tileWidth, object.tileHeight);
			
			var nextId = 0;
			var im = null;
			var asset = "";
			for(var i=0; i<object.images.length; i++){
				asset = this.getAssetById(object.images[i]);
				
				if(asset){
					im = map.addTilesetImage(asset.key, asset.key, asset.frameWidth, asset.frameHeight, asset.margin, asset.spacing, nextId);
					nextId += im.total;
				}
				else{
					console.warn("cannot find image", object.images[i]);
				}
			}
			
			var tiles = object.tiles;
			var tile = null;
			for(var y in tiles){
				for(var x in tiles[y]){
					tile = map.putTile(tiles[y][x], x, y, tl);
				}
			}
			tl.fixedToCamera = object.isFixedToCamera;
			return tl;
		},
		
		_addObject: function(object, group){
			
			var sp = null;
			group = group || this.game.world;
			
			if(group.type == Phaser.GROUP){
				sp = group.create(object.x, object.y, object.assetKey);
			}
			else{
				sp = this.game.add.sprite(object.x, object.y, object.assetKey);
				
				this.game.world.removeChild(sp);
				group.addChild(sp);
			}
			
			
			var frameData = this.game.cache.getFrameData(object.assetKey);
			
			if(frameData){
				var arr = [];
				for(var i=0; i<frameData.total; i++){
					arr.push(i);
				}
				sp.animations.add("default", arr, (object.fps !== void(0) ? object.fps : 10) , false);
				sp.frame = object.frame;
			}
			return sp;
		},
 
		_updateCommonProperties: function(template, object, keepVisibility){
			
			if(template.angle){
				object.angle = template.angle;
			}
			
			if(template.type !== mt.GROUP && object.type != Phaser.GROUP){
				object.anchor.x = template.anchorX;
				object.anchor.y = template.anchorY;
				if(template.scaleX != void(0)){
					object.scale.x = template.scaleX;
					object.scale.y = template.scaleY;
				}
			}
			
			object.x = template.x;
			object.y = template.y;
			object.alpha = template.alpha || 1;
			
			if(keepVisibility){
				object.visible = template.isVisible;
			}
		},
		
		//mark all texts dirty to force redraw
		_markDirty: function(group){
			group = group || game.world.children;
			
			var child = null;
			for(var i=0; i<group.length; i++){
				child = group[i];
				
				if(child.type == Phaser.TEXT){
					child.dirty = true;
					continue;
				}
				
				if(child.type == Phaser.GROUP){
					this.markDirty(child.children);
				}
			}
		}
 
	};
	
	
	var TweenCollection = function(movieName, pack, fps, length){
		this.name = movieName;
		
		this.onComplete = new Phaser.Signal();
		this._pack = pack;
		this._tweens = [];
		this._subtweens = [];
		this._mainTimer = null;
		this._startPos = [];
		
		this._delay = mt.game.time.create(false);
		
		if(fps){
			this._fps = fps;
			this._ifps = 1000/this._fps;
		}
		
		var tween = this._buildTweens(this._pack, true);
		
		if(movieName != mt.mainMovie){
			this._buildChildTweens(this._pack.children);
		}
		
	};
	
	TweenCollection.prototype = {
		isLooping: false,
		_fps: -1,
		_lastFrame: 60,
		_buildTweens: function(pack, isMain){
			var start, stop, tween, easings;
			
			var movie = pack.data.movies[this.name];
			if(!movie){
				return null;
			}
			if(isMain){
				if(this._fps == -1){
					if(movie.subdata){
						this._fps = mt.data.map.movieInfo.fps;
					}
					else{
						this._fps = movie.info.fps || mt.data.map.movieInfo.fps;
					}
					this._ifps = 1000/this._fps;
					
				}
				this._lastFrame =  mt.data.map.movieInfo.lastFrame;
				this._mainTimer = mt.game.time.create(false);
				
				if(movie.subdata && movie.subdata.length > 0){
					this._buildSubTweens(movie.subdata);
				}
			}
			
			if(movie.frames.length === 0){
				return null;
			}
			
			for(var i=0; i<movie.frames.length-1; i++){
				start = movie.frames[i];
				stop = movie.frames[i+1];
				if(start.keyframe > this._lastFrame){
					break;
				}
				easings = stop.easings;
				tween = this._addTween(pack.self, start, stop, easings, tween);
			}
			return tween;
		},
		
		_buildChildTweens: function(children){
			var child;
			for(var key in children){
				child = children[key];
				if(!child.mt || !child.mt.data.movies || !child.mt.data.movies[this.name]){
					continue;
				}
				this._buildTweens(child.mt);
				this._buildChildTweens(child.mt.children);
			}
		},
		
		_buildSubTweens: function(sub){
			var st, innerData;
			
			
			for(var i=0; i<sub.length; i++){
				innerData = sub[i].movies[this.name];
				if(!innerData || !innerData.frames || innerData.frames.length === 0){
					continue;
				}
				
				for(var c in this._pack.children){
					st = new TweenCollection(sub[i].name, this._pack.children[c].mt, this._fps);
					this._addSubTween(st);
				}
			}
		},
 
 
		/*
		 * TODO: make easings work
		 */
		_addTween: function(obj, start, stop, easings, nextTween){
			var tween;
			var ss = mt._mkDiff(start, stop);
			var st = start.keyframe * this._ifps;
			var et = (stop.keyframe - start.keyframe)* this._ifps;
			
			if(!nextTween){
				tween = mt.game.add.tween(obj);
				this._tweens.push(tween);
				this._startPos.push({obj: obj, start: start});
			}
			else{
				tween = nextTween;
			}
			tween = tween.to(ss, et);
			return tween;
		},
 
		_addSubTween: function(tween){
			this._subtweens.push(tween);
		},
		_stop: function(reset){
			var i, j;
			this._mainTimer.stop();
			
			for(i=0; i<this._subtweens.length; i++){
				this._subtweens[i].stop(reset);
			}
			
			for(i=0; i<this._tweens.length; i++){
				this._tweens[i].stop();
			}
			
			if(reset){
				this.reset();
			}
		},
		start: function(){
			var i, j;
			
			this._mainTimer.removeAll();
			
			this._mainTimer.add(this._ifps * this._lastFrame, this._complete, this);
			this._mainTimer.start();
			this.reset();
			
			for(i=0; i<this._subtweens.length; i++){
				this._subtweens[i].start();
			}
			
			for(i=0; i<this._tweens.length; i++){
				this._tweens[i].start();
			}
			
			
			return this;
		},
		stop: function(reset){
			
			this._stop(reset);
			
			this.isLooping = false;
			
			return this;
		},
		
		reset: function(){
			var op, sub;
			for(var i=0; i<this._startPos.length; i++){
				op = this._startPos[i];
				for(var k in op.start){
					op.obj[k] = op.start[k];
				}
			}
		},
		pause: function(name){
			var i, j, tween;
			this._mainTimer.pause();
			for(i=0; i<this._tweens.length; i++){
				tween = this._tweens[i];
				tween.pause();
				for(j=0; j<tween._chainedTweens.length; j++){
					tween = tween._chainedTweens[j];
					tween.pause();
				}
				
			}
			for(i=0; i<this._subtweens.length; i++){
				this._subtweens[i].pause();
			}
			
			return this;
		},
		resume: function(name){
			var i, j, tween;
			this._mainTimer.resume();
			for(i=0; i<this._tweens.length; i++){
				tween = this._tweens[i];
				tween.resume();
				for(j=0; j<tween._chainedTweens.length; j++){
					tween = tween._chainedTweens[j];
					tween.resume();
				}
				
				
			}
			for(i=0; i<this._subtweens.length; i++){
				this._subtweens[i].resume();
			}
			
			return this;
		},
		
		delay: function(ms){
			this.delay.removeAll();
			this._delay.add(ms, this.start, this);
			return this;
		},
		
		loop: function(){
			if(this.isLooping){
				return;
			}
			this.isLooping = true;
			for(var i=0; i<this._subtweens.length; i++){
				this._subtweens[i].loop();
			}
			return this;
		},
		
		_complete: function(){
			this.onComplete.dispatch(this);
			this._stop();
			if(this.isLooping){
				this.start();
			}
		}
		
	};
	
	global.mt.TweenCollection = TweenCollection;
})(typeof window == "undefined" ? global : window);
