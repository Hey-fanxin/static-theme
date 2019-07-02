/*!
 * LimeFamily v1.1.0 (http://xxxxxxxx.com)
 * Copyright 2017-2019 limefamily[bjp]
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/**
 * Created by bianjunping on 2018/1/12.
 */

+function ($) {
    'use strict';
  
    var DataKey = 'limefamily.pushmenu';
  
    var Default = {
      collapseScreenSize   : 767,
      expandOnHover        : false,
      expandTransitionDelay: 200
    };
  
    var Selector = {
      collapsed     : '.sidebar-collapse',
      open          : '.sidebar-open',
      mainSidebar   : '.main-sidebar',
      contentWrapper: '.content-wrapper',
      searchInput   : '.sidebar-form .form-control',
      button        : '[data-toggle="push-menu"]',
      mini          : '.sidebar-mini',
      expanded      : '.sidebar-expanded-on-hover',
      layoutFixed   : '.fixed'
    };
  
    var ClassName = {
      collapsed    : 'sidebar-collapse',
      open         : 'sidebar-open',
      mini         : 'sidebar-mini',
      expanded     : 'sidebar-expanded-on-hover',
      expandFeature: 'sidebar-mini-expand-feature',
      layoutFixed  : 'fixed'
    };
  
    var Event = {
      expanded : 'expanded.pushMenu',
      collapsed: 'collapsed.pushMenu'
    };
  
    // PushMenu Class Definition
    // =========================
    var PushMenu = function (options) {
      this.options = options;
      this.init();
    };
  
    PushMenu.prototype.init = function () {
      if (this.options.expandOnHover
        || ($('body').is(Selector.mini + Selector.layoutFixed))) {
        this.expandOnHover();
        $('body').addClass(ClassName.expandFeature);
      }
  
      $(Selector.contentWrapper).click(function () {
        // Enable hide menu when clicking on the content-wrapper on small screens
        if ($(window).width() <= this.options.collapseScreenSize && $('body').hasClass(ClassName.open)) {
          this.close();
        }
      }.bind(this));
  
      // __Fix for android devices
      $(Selector.searchInput).click(function (e) {
        e.stopPropagation();
      });
    };
  
    PushMenu.prototype.toggle = function () {
      var windowWidth = $(window).width();
      var isOpen      = !$('body').hasClass(ClassName.collapsed);
  
      if (windowWidth <= this.options.collapseScreenSize) {
        isOpen = $('body').hasClass(ClassName.open);
      }
  
      if (!isOpen) {
        this.open();
      } else {
        this.close();
      }
    };
  
    PushMenu.prototype.open = function () {
      var windowWidth = $(window).width();
  
      if (windowWidth > this.options.collapseScreenSize) {
        $('body').removeClass(ClassName.collapsed)
          .trigger($.Event(Event.expanded));
      }
      else {
        $('body').addClass(ClassName.open)
          .trigger($.Event(Event.expanded));
      }
    };
  
    PushMenu.prototype.close = function () {
      var windowWidth = $(window).width();
      if (windowWidth > this.options.collapseScreenSize) {
        $('body').addClass(ClassName.collapsed)
          .trigger($.Event(Event.collapsed));
      } else {
        $('body').removeClass(ClassName.open + ' ' + ClassName.collapsed)
          .trigger($.Event(Event.collapsed));
      }
    };
  
    PushMenu.prototype.expandOnHover = function () {
      $(Selector.mainSidebar).hover(function () {
        if ($('body').is(Selector.mini + Selector.collapsed)
          && $(window).width() > this.options.collapseScreenSize) {
          this.expand();
        }
      }.bind(this), function () {
        if ($('body').is(Selector.expanded)) {
          this.collapse();
        }
      }.bind(this));
    };
  
    PushMenu.prototype.expand = function () {
      setTimeout(function () {
        $('body').removeClass(ClassName.collapsed)
          .addClass(ClassName.expanded);
      }, this.options.expandTransitionDelay);
    };
  
    PushMenu.prototype.collapse = function () {
      setTimeout(function () {
        $('body').removeClass(ClassName.expanded)
          .addClass(ClassName.collapsed);
      }, this.options.expandTransitionDelay);
    };
  
    // PushMenu Plugin Definition
    // ==========================
    function Plugin(option) {
      return this.each(function () {
        var $this = $(this);
        var data  = $this.data(DataKey);
  
        if (!data) {
          var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option);
          $this.data(DataKey, (data = new PushMenu(options)));
        }
  
        if (option === 'toggle') data.toggle();
      });
    }
  
    var old = $.fn.pushMenu;
  
    $.fn.pushMenu             = Plugin;
    $.fn.pushMenu.Constructor = PushMenu;
  
    // No Conflict Mode
    // ================
    $.fn.pushMenu.noConflict = function () {
      $.fn.pushMenu = old;
      return this;
    };
  
    // Data API
    // ========
    $(document).on('click', Selector.button, function (e) {
      e.preventDefault();
      Plugin.call($(this), 'toggle');
    });
    $(window).on('load', function () {
      Plugin.call($(Selector.button));
    });
  }(jQuery);
/* Tree()
 * ======
 * Converts a nested list into a multilevel
 * tree view menu.
 *
 * @Usage: $('.my-menu').tree(options)
 *         or add [data-widget="tree"] to the ul element
 *         Pass any option as data-option="value"
 */
+function ($) {
  'use strict';

  var DataKey = 'limefamily.tree';

  var Default = {
    animationSpeed: 500,
    accordion     : true,
    followLink    : false,
    trigger       : '.treeview a'
  };

  var Selector = {
    tree        : '.tree',
    treeview    : '.treeview',
    treeviewMenu: '.treeview-menu',
    open        : '.menu-open, .active',
    li          : 'li',
    data        : '[data-widget="tree"]',
    active      : '.active'
  };

  var ClassName = {
    open: 'menu-open',
    tree: 'tree'
  };

  var Event = {
    collapsed: 'collapsed.tree',
    expanded : 'expanded.tree'
  };

  // Tree Class Definition
  // =====================
  var Tree = function (element, options) {
    this.element = element;
    this.options = options;
    // var url = window.location.href.split('?')[1].split('&')[0].split('=')[1].split('%2');
    // console.log(url)
    $(this.element).addClass(ClassName.tree);

    $(Selector.treeview + Selector.active, this.element).addClass(ClassName.open);

    this._setUpListeners();
  };

  Tree.prototype.toggle = function (link, event) {
    var treeviewMenu = link.next(Selector.treeviewMenu);
    var parentLi     = link.parent();
    var isOpen       = parentLi.hasClass(ClassName.open);

    if (!parentLi.is(Selector.treeview)) {
      return;
    }

    if (!this.options.followLink || link.attr('href') === '#') {
      event.preventDefault();
    }

    if (isOpen) {
      this.collapse(treeviewMenu, parentLi);
    } else {
      this.expand(treeviewMenu, parentLi);
    }
  };

  Tree.prototype.expand = function (tree, parent) {
    var expandedEvent = $.Event(Event.expanded);

    if (this.options.accordion) {
      var openMenuLi = parent.siblings(Selector.open);
      var openTree   = openMenuLi.children(Selector.treeviewMenu);
      this.collapse(openTree, openMenuLi);
    }

    parent.addClass(ClassName.open);
    tree.slideDown(this.options.animationSpeed, function () {
      $(this.element).trigger(expandedEvent);
    }.bind(this));
  };

  Tree.prototype.collapse = function (tree, parentLi) {
    var collapsedEvent = $.Event(Event.collapsed);

    //tree.find(Selector.open).removeClass(ClassName.open);
    parentLi.removeClass(ClassName.open);
    tree.slideUp(this.options.animationSpeed, function () {
      //tree.find(Selector.open + ' > ' + Selector.treeview).slideUp();
      $(this.element).trigger(collapsedEvent);
    }.bind(this));
  };

  // Private

  Tree.prototype._setUpListeners = function () {
    var that = this;

    $(this.element).on('click', this.options.trigger, function (event) {
      that.toggle($(this), event);
    });
  };

  // Plugin Definition
  // =================
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data  = $this.data(DataKey);

      if (!data) {
        var options = $.extend({}, Default, $this.data(), typeof option == 'object' && option);
        $this.data(DataKey, new Tree($this, options));
      }
    });
  }

  var old = $.fn.tree;

  $.fn.tree             = Plugin;
  $.fn.tree.Constructor = Tree;

  // No Conflict Mode
  // ================
  $.fn.tree.noConflict = function () {
    $.fn.tree = old;
    return this;
  };

  // Tree Data API
  // =============
  $(window).on('load', function () {
    $(Selector.data).each(function () {
      Plugin.call($(this));
    });
  });

}(jQuery);
