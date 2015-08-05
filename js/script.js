    var transformProp = Modernizr.prefixed('transform');

    function Carousel3D ( element ) {
      this.element = element;

      this.rotation = 0;
      this.panelCount = 0;
      this.totalPanelCount = this.element.children.length;
      this.theta = 0;

      this.isHorizontal = true;

    }

    Carousel3D.prototype.modify = function() {

      var panel, angle, i;

      this.panelSize = this.element[ this.isHorizontal ? 'offsetWidth' : 'offsetHeight' ];
      this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
      this.theta = 360 / this.panelCount;

      // 計算整體大小

      this.radius = Math.round( ( this.panelSize / 2) / Math.tan( Math.PI / this.panelCount ) ) +500;

      for ( i = 0; i < this.panelCount; i++ ) {
        panel = this.element.children[i];
        angle = this.theta * i;
        panel.style.opacity = 1;
        panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 50%, 0.8)';
        // 旋轉

        panel.style[ transformProp ] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
      }

      // 隱藏其他圖片
      for (  ; i < this.totalPanelCount; i++ ) {
        panel = this.element.children[i];
        panel.style.opacity = 0;
        panel.style[ transformProp ] = 'none';
      }

      // adjust rotation so panels are always flat
      this.rotation = Math.round( this.rotation / this.theta ) * this.theta;

      this.transform();

    };

    Carousel3D.prototype.transform = function() {
      // 旋轉
      this.element.style[ transformProp ] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';
    };



    var init = function() {


      var carousel = new Carousel3D( document.getElementById('carousel') );
          //panelCountInput = document.getElementById('panel-count'),
          //axisButton = document.getElementById('toggle-axis'),
          //navButtons = document.querySelectorAll('#navigation button'),



      carousel.panelCount = parseInt( 15, 10);
      carousel.modify();

      setTimeout( function(){
        document.body.addClassName('ready');
      }, 0);

      ////////
      //info//
      ////////

      info = document.createElement( 'div' );
      info.style.position = 'absolute';
      info.style.top = '30px';
      info.style.width = '100%';
      info.style.textAlign = 'center';
      info.style.color = '#fff';
      info.style.fontWeight = 'bold';
      info.style.backgroundColor = 'transparent';
      info.style.zIndex = '1';
      info.style.fontFamily = 'Monospace';
      info.innerHTML = 'CSS3D Carousel by johnhckuo';
      document.body.appendChild( info );

      /////////
      //panel//
      /////////

      var gui = new dat.GUI();

      var params = {
          Panels: 15
      };


      var button = { ToogleAxis:function(){ 
        carousel.isHorizontal = !carousel.isHorizontal;
        carousel.modify(); 
      }};
      gui.add(button,'ToogleAxis');

      var button2 = { BackfaceVisibility:function(){ carousel.element.toggleClassName('panels-backface-invisible'); }};
      gui.add(button2,'BackfaceVisibility');

      var button3 = { Next:function(){ 
        var increment = 1;
        carousel.rotation += carousel.theta * increment * -1;
        carousel.transform();
      }};
      gui.add(button3,'Next');

      var button4 = { Previous:function(){ 
        var increment = -1;
        carousel.rotation += carousel.theta * increment * -1;
        carousel.transform();
      }};
      gui.add(button4,'Previous');

      gui.add(params, 'Panels').min(3).max(20).step(1).onFinishChange(function(){

          carousel.panelCount = params.Panels;
          carousel.modify();
      });


    };

    window.addEventListener( 'DOMContentLoaded', init, false);