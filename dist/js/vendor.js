/*!
 * Bootstrap v3.3.2 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.2
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.2
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.2'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.2
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.2'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.2
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.2'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.2
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.2'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.2
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.2'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.2
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.2'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (that.options.backdrop) that.adjustBackdrop()
      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .prependTo(this.$element)
        .on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    if (this.options.backdrop) this.adjustBackdrop()
    this.adjustDialog()
  }

  Modal.prototype.adjustBackdrop = function () {
    this.$backdrop
      .css('height', 0)
      .css('height', this.$element[0].scrollHeight)
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.2
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.2'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
      .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isHorizontal ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.2
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.2'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.2
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.2'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.2
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.2'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.2
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.2'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/*!
 * jQuery Validation Plugin v1.13.1
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

$.extend($.fn, {
	// http://jqueryvalidation.org/validate/
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if ( !this.length ) {
			if ( options && options.debug && window.console ) {
				console.warn( "Nothing selected, can't validate, returning nothing." );
			}
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data( this[ 0 ], "validator" );
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr( "novalidate", "novalidate" );

		validator = new $.validator( options, this[ 0 ] );
		$.data( this[ 0 ], "validator", validator );

		if ( validator.settings.onsubmit ) {

			this.validateDelegate( ":submit", "click", function( event ) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = event.target;
				}
				// allow suppressing validation by adding a cancel class to the submit button
				if ( $( event.target ).hasClass( "cancel" ) ) {
					validator.cancelSubmit = true;
				}

				// allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
				if ( $( event.target ).attr( "formnovalidate" ) !== undefined ) {
					validator.cancelSubmit = true;
				}
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug ) {
					// prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden, result;
					if ( validator.settings.submitHandler ) {
						if ( validator.submitButton ) {
							// insert a hidden input as a replacement for the missing submit button
							hidden = $( "<input type='hidden'/>" )
								.attr( "name", validator.submitButton.name )
								.val( $( validator.submitButton ).val() )
								.appendTo( validator.currentForm );
						}
						result = validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if ( validator.submitButton ) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						if ( result !== undefined ) {
							return result;
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://jqueryvalidation.org/valid/
	valid: function() {
		var valid, validator;

		if ( $( this[ 0 ] ).is( "form" ) ) {
			valid = this.validate().form();
		} else {
			valid = true;
			validator = $( this[ 0 ].form ).validate();
			this.each( function() {
				valid = validator.element( this ) && valid;
			});
		}
		return valid;
	},
	// attributes: space separated list of attributes to retrieve and remove
	removeAttrs: function( attributes ) {
		var result = {},
			$element = this;
		$.each( attributes.split( /\s/ ), function( index, value ) {
			result[ value ] = $element.attr( value );
			$element.removeAttr( value );
		});
		return result;
	},
	// http://jqueryvalidation.org/rules/
	rules: function( command, argument ) {
		var element = this[ 0 ],
			settings, staticRules, existingRules, data, param, filtered;

		if ( command ) {
			settings = $.data( element.form, "validator" ).settings;
			staticRules = settings.rules;
			existingRules = $.validator.staticRules( element );
			switch ( command ) {
			case "add":
				$.extend( existingRules, $.validator.normalizeRule( argument ) );
				// remove messages from rules, but allow them to be set separately
				delete existingRules.messages;
				staticRules[ element.name ] = existingRules;
				if ( argument.messages ) {
					settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
				}
				break;
			case "remove":
				if ( !argument ) {
					delete staticRules[ element.name ];
					return existingRules;
				}
				filtered = {};
				$.each( argument.split( /\s/ ), function( index, method ) {
					filtered[ method ] = existingRules[ method ];
					delete existingRules[ method ];
					if ( method === "required" ) {
						$( element ).removeAttr( "aria-required" );
					}
				});
				return filtered;
			}
		}

		data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.classRules( element ),
			$.validator.attributeRules( element ),
			$.validator.dataRules( element ),
			$.validator.staticRules( element )
		), element );

		// make sure required is at front
		if ( data.required ) {
			param = data.required;
			delete data.required;
			data = $.extend( { required: param }, data );
			$( element ).attr( "aria-required", "true" );
		}

		// make sure remote is at back
		if ( data.remote ) {
			param = data.remote;
			delete data.remote;
			data = $.extend( data, { remote: param });
		}

		return data;
	}
});

// Custom selectors
$.extend( $.expr[ ":" ], {
	// http://jqueryvalidation.org/blank-selector/
	blank: function( a ) {
		return !$.trim( "" + $( a ).val() );
	},
	// http://jqueryvalidation.org/filled-selector/
	filled: function( a ) {
		return !!$.trim( "" + $( a ).val() );
	},
	// http://jqueryvalidation.org/unchecked-selector/
	unchecked: function( a ) {
		return !$( a ).prop( "checked" );
	}
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

// http://jqueryvalidation.org/jQuery.validator.format/
$.validator.format = function( source, params ) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray( arguments );
			args.unshift( source );
			return $.validator.format.apply( this, args );
		};
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray( arguments ).slice( 1 );
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each( params, function( i, n ) {
		source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
			return n;
		});
	});
	return source;
};

$.extend( $.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusCleanup: false,
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function( element ) {
			this.lastActive = element;

			// Hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.hideThese( this.errorsFor( element ) );
			}
		},
		onfocusout: function( element ) {
			if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
				this.element( element );
			}
		},
		onkeyup: function( element, event ) {
			if ( event.which === 9 && this.elementValue( element ) === "" ) {
				return;
			} else if ( element.name in this.submitted || element === this.lastElement ) {
				this.element( element );
			}
		},
		onclick: function( element ) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element( element );

			// or option elements, check parent select in that case
			} else if ( element.parentNode.name in this.submitted ) {
				this.element( element.parentNode );
			}
		},
		highlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
			} else {
				$( element ).addClass( errorClass ).removeClass( validClass );
			}
		},
		unhighlight: function( element, errorClass, validClass ) {
			if ( element.type === "radio" ) {
				this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
			} else {
				$( element ).removeClass( errorClass ).addClass( validClass );
			}
		}
	},

	// http://jqueryvalidation.org/jQuery.validator.setDefaults/
	setDefaults: function( settings ) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date ( ISO ).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		maxlength: $.validator.format( "Please enter no more than {0} characters." ),
		minlength: $.validator.format( "Please enter at least {0} characters." ),
		rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
		range: $.validator.format( "Please enter a value between {0} and {1}." ),
		max: $.validator.format( "Please enter a value less than or equal to {0}." ),
		min: $.validator.format( "Please enter a value greater than or equal to {0}." )
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $( this.settings.errorLabelContainer );
			this.errorContext = this.labelContainer.length && this.labelContainer || $( this.currentForm );
			this.containers = $( this.settings.errorContainer ).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = ( this.groups = {} ),
				rules;
			$.each( this.settings.groups, function( key, value ) {
				if ( typeof value === "string" ) {
					value = value.split( /\s/ );
				}
				$.each( value, function( index, name ) {
					groups[ name ] = key;
				});
			});
			rules = this.settings.rules;
			$.each( rules, function( key, value ) {
				rules[ key ] = $.validator.normalizeRule( value );
			});

			function delegate( event ) {
				var validator = $.data( this[ 0 ].form, "validator" ),
					eventType = "on" + event.type.replace( /^validate/, "" ),
					settings = validator.settings;
				if ( settings[ eventType ] && !this.is( settings.ignore ) ) {
					settings[ eventType ].call( validator, this[ 0 ], event );
				}
			}
			$( this.currentForm )
				.validateDelegate( ":text, [type='password'], [type='file'], select, textarea, " +
					"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
					"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], " +
					"[type='range'], [type='color'], [type='radio'], [type='checkbox']",
					"focusin focusout keyup", delegate)
				// Support: Chrome, oldIE
				// "select" is provided as event.target when clicking a option
				.validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", delegate);

			if ( this.settings.invalidHandler ) {
				$( this.currentForm ).bind( "invalid-form.validate", this.settings.invalidHandler );
			}

			// Add aria-required to any Static/Data/Class required fields before first validation
			// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
			$( this.currentForm ).find( "[required], [data-rule-required], .required" ).attr( "aria-required", "true" );
		},

		// http://jqueryvalidation.org/Validator.form/
		form: function() {
			this.checkForm();
			$.extend( this.submitted, this.errorMap );
			this.invalid = $.extend({}, this.errorMap );
			if ( !this.valid() ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ]);
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = ( this.currentElements = this.elements() ); elements[ i ]; i++ ) {
				this.check( elements[ i ] );
			}
			return this.valid();
		},

		// http://jqueryvalidation.org/Validator.element/
		element: function( element ) {
			var cleanElement = this.clean( element ),
				checkElement = this.validationTargetFor( cleanElement ),
				result = true;

			this.lastElement = checkElement;

			if ( checkElement === undefined ) {
				delete this.invalid[ cleanElement.name ];
			} else {
				this.prepareElement( checkElement );
				this.currentElements = $( checkElement );

				result = this.check( checkElement ) !== false;
				if ( result ) {
					delete this.invalid[ checkElement.name ];
				} else {
					this.invalid[ checkElement.name ] = true;
				}
			}
			// Add aria-invalid status for screen readers
			$( element ).attr( "aria-invalid", !result );

			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://jqueryvalidation.org/Validator.showErrors/
		showErrors: function( errors ) {
			if ( errors ) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[ name ],
						element: this.findByName( name )[ 0 ]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function( element ) {
					return !( element.name in errors );
				});
			}
			if ( this.settings.showErrors ) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://jqueryvalidation.org/Validator.resetForm/
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$( this.currentForm ).resetForm();
			}
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			this.elements()
					.removeClass( this.settings.errorClass )
					.removeData( "previousValue" )
					.removeAttr( "aria-invalid" );
		},

		numberOfInvalids: function() {
			return this.objectLength( this.invalid );
		},

		objectLength: function( obj ) {
			/* jshint unused: false */
			var count = 0,
				i;
			for ( i in obj ) {
				count++;
			}
			return count;
		},

		hideErrors: function() {
			this.hideThese( this.toHide );
		},

		hideThese: function( errors ) {
			errors.not( this.containers ).text( "" );
			this.addWrapper( errors ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if ( this.settings.focusInvalid ) {
				try {
					$( this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [])
					.filter( ":visible" )
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger( "focusin" );
				} catch ( e ) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep( this.errorList, function( n ) {
				return n.element.name === lastActive.name;
			}).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $( this.currentForm )
			.find( "input, select, textarea" )
			.not( ":submit, :reset, :image, [disabled], [readonly]" )
			.not( this.settings.ignore )
			.filter( function() {
				if ( !this.name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this );
				}

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength( $( this ).rules() ) ) {
					return false;
				}

				rulesCache[ this.name ] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $( selector )[ 0 ];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.split( " " ).join( "." );
			return $( this.settings.errorElement + "." + errorClass, this.errorContext );
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $( [] );
			this.toHide = $( [] );
			this.currentElements = $( [] );
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor( element );
		},

		elementValue: function( element ) {
			var val,
				$element = $( element ),
				type = element.type;

			if ( type === "radio" || type === "checkbox" ) {
				return $( "input[name='" + element.name + "']:checked" ).val();
			} else if ( type === "number" && typeof element.validity !== "undefined" ) {
				return element.validity.badInput ? false : $element.val();
			}

			val = $element.val();
			if ( typeof val === "string" ) {
				return val.replace(/\r/g, "" );
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $( element ).rules(),
				rulesCount = $.map( rules, function( n, i ) {
					return i;
				}).length,
				dependencyMismatch = false,
				val = this.elementValue( element ),
				result, method, rule;

			for ( method in rules ) {
				rule = { method: method, parameters: rules[ method ] };
				try {

					result = $.validator.methods[ method ].call( this, val, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" && rulesCount === 1 ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor( element ) );
						return;
					}

					if ( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch ( e ) {
					if ( this.settings.debug && window.console ) {
						console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
					}
					throw e;
				}
			}
			if ( dependencyMismatch ) {
				return;
			}
			if ( this.objectLength( rules ) ) {
				this.successList.push( element );
			}
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's HTML5 data attribute
		// return the generic message if present and no method specific message is present
		customDataMessage: function( element, method ) {
			return $( element ).data( "msg" + method.charAt( 0 ).toUpperCase() +
				method.substring( 1 ).toLowerCase() ) || $( element ).data( "msg" );
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[ name ];
			return m && ( m.constructor === String ? m : m[ method ]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for ( var i = 0; i < arguments.length; i++) {
				if ( arguments[ i ] !== undefined ) {
					return arguments[ i ];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, method ) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customDataMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[ method ],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call( this, rule.parameters, element );
			} else if ( theregex.test( message ) ) {
				message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
			}
			this.errorList.push({
				message: message,
				element: element,
				method: rule.method
			});

			this.errorMap[ element.name ] = message;
			this.submitted[ element.name ] = message;
		},

		addWrapper: function( toToggle ) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements, error;
			for ( i = 0; this.errorList[ i ]; i++ ) {
				error = this.errorList[ i ];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if ( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if ( this.settings.success ) {
				for ( i = 0; this.successList[ i ]; i++ ) {
					this.showLabel( this.successList[ i ] );
				}
			}
			if ( this.settings.unhighlight ) {
				for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
					this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not( this.invalidElements() );
		},

		invalidElements: function() {
			return $( this.errorList ).map(function() {
				return this.element;
			});
		},

		showLabel: function( element, message ) {
			var place, group, errorID,
				error = this.errorsFor( element ),
				elementID = this.idOrName( element ),
				describedBy = $( element ).attr( "aria-describedby" );
			if ( error.length ) {
				// refresh error/success class
				error.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
				// replace message on existing label
				error.html( message );
			} else {
				// create error element
				error = $( "<" + this.settings.errorElement + ">" )
					.attr( "id", elementID + "-error" )
					.addClass( this.settings.errorClass )
					.html( message || "" );

				// Maintain reference to the element to be placed into the DOM
				place = error;
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					place = error.hide().show().wrap( "<" + this.settings.wrapper + "/>" ).parent();
				}
				if ( this.labelContainer.length ) {
					this.labelContainer.append( place );
				} else if ( this.settings.errorPlacement ) {
					this.settings.errorPlacement( place, $( element ) );
				} else {
					place.insertAfter( element );
				}

				// Link error back to the element
				if ( error.is( "label" ) ) {
					// If the error is a label, then associate using 'for'
					error.attr( "for", elementID );
				} else if ( error.parents( "label[for='" + elementID + "']" ).length === 0 ) {
					// If the element is not a child of an associated label, then it's necessary
					// to explicitly apply aria-describedby

					errorID = error.attr( "id" ).replace( /(:|\.|\[|\])/g, "\\$1");
					// Respect existing non-error aria-describedby
					if ( !describedBy ) {
						describedBy = errorID;
					} else if ( !describedBy.match( new RegExp( "\\b" + errorID + "\\b" ) ) ) {
						// Add to end of list if not already present
						describedBy += " " + errorID;
					}
					$( element ).attr( "aria-describedby", describedBy );

					// If this element is grouped, then assign to all elements in the same group
					group = this.groups[ element.name ];
					if ( group ) {
						$.each( this.groups, function( name, testgroup ) {
							if ( testgroup === group ) {
								$( "[name='" + name + "']", this.currentForm )
									.attr( "aria-describedby", error.attr( "id" ) );
							}
						});
					}
				}
			}
			if ( !message && this.settings.success ) {
				error.text( "" );
				if ( typeof this.settings.success === "string" ) {
					error.addClass( this.settings.success );
				} else {
					this.settings.success( error, element );
				}
			}
			this.toShow = this.toShow.add( error );
		},

		errorsFor: function( element ) {
			var name = this.idOrName( element ),
				describer = $( element ).attr( "aria-describedby" ),
				selector = "label[for='" + name + "'], label[for='" + name + "'] *";

			// aria-describedby should directly reference the error element
			if ( describer ) {
				selector = selector + ", #" + describer.replace( /\s+/g, ", #" );
			}
			return this
				.errors()
				.filter( selector );
		},

		idOrName: function( element ) {
			return this.groups[ element.name ] || ( this.checkable( element ) ? element.name : element.id || element.name );
		},

		validationTargetFor: function( element ) {

			// If radio/checkbox, validate first element in group instead
			if ( this.checkable( element ) ) {
				element = this.findByName( element.name );
			}

			// Always apply ignore filter
			return $( element ).not( this.settings.ignore )[ 0 ];
		},

		checkable: function( element ) {
			return ( /radio|checkbox/i ).test( element.type );
		},

		findByName: function( name ) {
			return $( this.currentForm ).find( "[name='" + name + "']" );
		},

		getLength: function( value, element ) {
			switch ( element.nodeName.toLowerCase() ) {
			case "select":
				return $( "option:selected", element ).length;
			case "input":
				if ( this.checkable( element ) ) {
					return this.findByName( element.name ).filter( ":checked" ).length;
				}
			}
			return value.length;
		},

		depend: function( param, element ) {
			return this.dependTypes[typeof param] ? this.dependTypes[typeof param]( param, element ) : true;
		},

		dependTypes: {
			"boolean": function( param ) {
				return param;
			},
			"string": function( param, element ) {
				return !!$( param, element.form ).length;
			},
			"function": function( param, element ) {
				return param( element );
			}
		},

		optional: function( element ) {
			var val = this.elementValue( element );
			return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
		},

		startRequest: function( element ) {
			if ( !this.pending[ element.name ] ) {
				this.pendingRequest++;
				this.pending[ element.name ] = true;
			}
		},

		stopRequest: function( element, valid ) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if ( this.pendingRequest < 0 ) {
				this.pendingRequest = 0;
			}
			delete this.pending[ element.name ];
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$( this.currentForm ).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted ) {
				$( this.currentForm ).triggerHandler( "invalid-form", [ this ]);
				this.formSubmitted = false;
			}
		},

		previousValue: function( element ) {
			return $.data( element, "previousValue" ) || $.data( element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: { required: true },
		email: { email: true },
		url: { url: true },
		date: { date: true },
		dateISO: { dateISO: true },
		number: { number: true },
		digits: { digits: true },
		creditcard: { creditcard: true }
	},

	addClassRules: function( className, rules ) {
		if ( className.constructor === String ) {
			this.classRuleSettings[ className ] = rules;
		} else {
			$.extend( this.classRuleSettings, className );
		}
	},

	classRules: function( element ) {
		var rules = {},
			classes = $( element ).attr( "class" );

		if ( classes ) {
			$.each( classes.split( " " ), function() {
				if ( this in $.validator.classRuleSettings ) {
					$.extend( rules, $.validator.classRuleSettings[ this ]);
				}
			});
		}
		return rules;
	},

	attributeRules: function( element ) {
		var rules = {},
			$element = $( element ),
			type = element.getAttribute( "type" ),
			method, value;

		for ( method in $.validator.methods ) {

			// support for <input required> in both html5 and older browsers
			if ( method === "required" ) {
				value = element.getAttribute( method );
				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if ( value === "" ) {
					value = true;
				}
				// force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr( method );
			}

			// convert the value to a number for number inputs, and for text for backwards compability
			// allows type="date" and others to be compared as strings
			if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
				value = Number( value );
			}

			if ( value || value === 0 ) {
				rules[ method ] = value;
			} else if ( type === method && type !== "range" ) {
				// exception: the jquery validate 'range' method
				// does not test for the html5 'range' type
				rules[ method ] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
		if ( rules.maxlength && /-1|2147483647|524288/.test( rules.maxlength ) ) {
			delete rules.maxlength;
		}

		return rules;
	},

	dataRules: function( element ) {
		var method, value,
			rules = {}, $element = $( element );
		for ( method in $.validator.methods ) {
			value = $element.data( "rule" + method.charAt( 0 ).toUpperCase() + method.substring( 1 ).toLowerCase() );
			if ( value !== undefined ) {
				rules[ method ] = value;
			}
		}
		return rules;
	},

	staticRules: function( element ) {
		var rules = {},
			validator = $.data( element.form, "validator" );

		if ( validator.settings.rules ) {
			rules = $.validator.normalizeRule( validator.settings.rules[ element.name ] ) || {};
		}
		return rules;
	},

	normalizeRules: function( rules, element ) {
		// handle dependency check
		$.each( rules, function( prop, val ) {
			// ignore rule when param is explicitly false, eg. required:false
			if ( val === false ) {
				delete rules[ prop ];
				return;
			}
			if ( val.param || val.depends ) {
				var keepRule = true;
				switch ( typeof val.depends ) {
				case "string":
					keepRule = !!$( val.depends, element.form ).length;
					break;
				case "function":
					keepRule = val.depends.call( element, element );
					break;
				}
				if ( keepRule ) {
					rules[ prop ] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[ prop ];
				}
			}
		});

		// evaluate parameters
		$.each( rules, function( rule, parameter ) {
			rules[ rule ] = $.isFunction( parameter ) ? parameter( element ) : parameter;
		});

		// clean number parameters
		$.each([ "minlength", "maxlength" ], function() {
			if ( rules[ this ] ) {
				rules[ this ] = Number( rules[ this ] );
			}
		});
		$.each([ "rangelength", "range" ], function() {
			var parts;
			if ( rules[ this ] ) {
				if ( $.isArray( rules[ this ] ) ) {
					rules[ this ] = [ Number( rules[ this ][ 0 ]), Number( rules[ this ][ 1 ] ) ];
				} else if ( typeof rules[ this ] === "string" ) {
					parts = rules[ this ].replace(/[\[\]]/g, "" ).split( /[\s,]+/ );
					rules[ this ] = [ Number( parts[ 0 ]), Number( parts[ 1 ] ) ];
				}
			}
		});

		if ( $.validator.autoCreateRanges ) {
			// auto-create ranges
			if ( rules.min != null && rules.max != null ) {
				rules.range = [ rules.min, rules.max ];
				delete rules.min;
				delete rules.max;
			}
			if ( rules.minlength != null && rules.maxlength != null ) {
				rules.rangelength = [ rules.minlength, rules.maxlength ];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function( data ) {
		if ( typeof data === "string" ) {
			var transformed = {};
			$.each( data.split( /\s/ ), function() {
				transformed[ this ] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://jqueryvalidation.org/jQuery.validator.addMethod/
	addMethod: function( name, method, message ) {
		$.validator.methods[ name ] = method;
		$.validator.messages[ name ] = message !== undefined ? message : $.validator.messages[ name ];
		if ( method.length < 3 ) {
			$.validator.addClassRules( name, $.validator.normalizeRule( name ) );
		}
	},

	methods: {

		// http://jqueryvalidation.org/required-method/
		required: function( value, element, param ) {
			// check if dependency is met
			if ( !this.depend( param, element ) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {
				// could be an array for select-multiple or a string, both are fine this way
				var val = $( element ).val();
				return val && val.length > 0;
			}
			if ( this.checkable( element ) ) {
				return this.getLength( value, element ) > 0;
			}
			return $.trim( value ).length > 0;
		},

		// http://jqueryvalidation.org/email-method/
		email: function( value, element ) {
			// From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
			// Retrieved 2014-01-14
			// If you have a problem with this implementation, report a bug against the above spec
			// Or use custom methods to implement your own email validation
			return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
		},

		// http://jqueryvalidation.org/url-method/
		url: function( value, element ) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional( element ) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test( value );
		},

		// http://jqueryvalidation.org/date-method/
		date: function( value, element ) {
			return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
		},

		// http://jqueryvalidation.org/dateISO-method/
		dateISO: function( value, element ) {
			return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
		},

		// http://jqueryvalidation.org/number-method/
		number: function( value, element ) {
			return this.optional( element ) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
		},

		// http://jqueryvalidation.org/digits-method/
		digits: function( value, element ) {
			return this.optional( element ) || /^\d+$/.test( value );
		},

		// http://jqueryvalidation.org/creditcard-method/
		// based on http://en.wikipedia.org/wiki/Luhn/
		creditcard: function( value, element ) {
			if ( this.optional( element ) ) {
				return "dependency-mismatch";
			}
			// accept only spaces, digits and dashes
			if ( /[^0-9 \-]+/.test( value ) ) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false,
				n, cDigit;

			value = value.replace( /\D/g, "" );

			// Basing min and max length on
			// http://developer.ean.com/general_info/Valid_Credit_Card_Types
			if ( value.length < 13 || value.length > 19 ) {
				return false;
			}

			for ( n = value.length - 1; n >= 0; n--) {
				cDigit = value.charAt( n );
				nDigit = parseInt( cDigit, 10 );
				if ( bEven ) {
					if ( ( nDigit *= 2 ) > 9 ) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return ( nCheck % 10 ) === 0;
		},

		// http://jqueryvalidation.org/minlength-method/
		minlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length >= param;
		},

		// http://jqueryvalidation.org/maxlength-method/
		maxlength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || length <= param;
		},

		// http://jqueryvalidation.org/rangelength-method/
		rangelength: function( value, element, param ) {
			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
			return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/min-method/
		min: function( value, element, param ) {
			return this.optional( element ) || value >= param;
		},

		// http://jqueryvalidation.org/max-method/
		max: function( value, element, param ) {
			return this.optional( element ) || value <= param;
		},

		// http://jqueryvalidation.org/range-method/
		range: function( value, element, param ) {
			return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
		},

		// http://jqueryvalidation.org/equalTo-method/
		equalTo: function( value, element, param ) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $( param );
			if ( this.settings.onfocusout ) {
				target.unbind( ".validate-equalTo" ).bind( "blur.validate-equalTo", function() {
					$( element ).valid();
				});
			}
			return value === target.val();
		},

		// http://jqueryvalidation.org/remote-method/
		remote: function( value, element, param ) {
			if ( this.optional( element ) ) {
				return "dependency-mismatch";
			}

			var previous = this.previousValue( element ),
				validator, data;

			if (!this.settings.messages[ element.name ] ) {
				this.settings.messages[ element.name ] = {};
			}
			previous.originalMessage = this.settings.messages[ element.name ].remote;
			this.settings.messages[ element.name ].remote = previous.message;

			param = typeof param === "string" && { url: param } || param;

			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			validator = this;
			this.startRequest( element );
			data = {};
			data[ element.name ] = value;
			$.ajax( $.extend( true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				context: validator.currentForm,
				success: function( response ) {
					var valid = response === true || response === "true",
						errors, message, submitted;

					validator.settings.messages[ element.name ].remote = previous.originalMessage;
					if ( valid ) {
						submitted = validator.formSubmitted;
						validator.prepareElement( element );
						validator.formSubmitted = submitted;
						validator.successList.push( element );
						delete validator.invalid[ element.name ];
						validator.showErrors();
					} else {
						errors = {};
						message = response || validator.defaultMessage( element, "remote" );
						errors[ element.name ] = previous.message = $.isFunction( message ) ? message( value ) : message;
						validator.invalid[ element.name ] = true;
						validator.showErrors( errors );
					}
					previous.valid = valid;
					validator.stopRequest( element, valid );
				}
			}, param ) );
			return "pending";
		}

	}

});

$.format = function deprecated() {
	throw "$.format has been deprecated. Please use $.validator.format instead.";
};

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

var pendingRequests = {},
	ajax;
// Use a prefilter if available (1.5+)
if ( $.ajaxPrefilter ) {
	$.ajaxPrefilter(function( settings, _, xhr ) {
		var port = settings.port;
		if ( settings.mode === "abort" ) {
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			pendingRequests[port] = xhr;
		}
	});
} else {
	// Proxy ajax
	ajax = $.ajax;
	$.ajax = function( settings ) {
		var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
			port = ( "port" in settings ? settings : $.ajaxSettings ).port;
		if ( mode === "abort" ) {
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			pendingRequests[port] = ajax.apply(this, arguments);
			return pendingRequests[port];
		}
		return ajax.apply(this, arguments);
	};
}

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target

$.extend($.fn, {
	validateDelegate: function( delegate, type, handler ) {
		return this.bind(type, function( event ) {
			var target = $(event.target);
			if ( target.is(delegate) ) {
				return handler.apply(target, arguments);
			}
		});
	}
});

}));
var cssua=function(k,n){var p=/\s*([\-\w ]+)[\s\/\:]([\d_]+\b(?:[\-\._\/]\w+)*)/,q=/([\w\-\.]+[\s\/][v]?[\d_]+\b(?:[\-\._\/]\w+)*)/g,r=/\b(?:(blackberry\w*|bb10)|(rim tablet os))(?:\/(\d+\.\d+(?:\.\w+)*))?/,s=/\bsilk-accelerated=true\b/,t=/\bfluidapp\b/,u=/(\bwindows\b|\bmacintosh\b|\blinux\b|\bunix\b)/,v=/(\bandroid\b|\bipad\b|\bipod\b|\bwindows phone\b|\bwpdesktop\b|\bxblwp7\b|\bzunewp7\b|\bwindows ce\b|\bblackberry\w*|\bbb10\b|\brim tablet os\b|\bmeego|\bwebos\b|\bpalm|\bsymbian|\bj2me\b|\bdocomo\b|\bpda\b|\bchtml\b|\bmidp\b|\bcldc\b|\w*?mobile\w*?|\w*?phone\w*?)/,
w=/(\bxbox\b|\bplaystation\b|\bnintendo\s+\w+)/,d={parse:function(c){var a={};c=(""+c).toLowerCase();if(!c)return a;for(var b,g,e=c.split(/[()]/),f=0,d=e.length;f<d;f++)if(f%2){var l=e[f].split(";");b=0;for(g=l.length;b<g;b++)if(p.exec(l[b])){var h=RegExp.$1.split(" ").join("_"),k=RegExp.$2;if(!a[h]||parseFloat(a[h])<parseFloat(k))a[h]=k}}else if(l=e[f].match(q))for(b=0,g=l.length;b<g;b++)h=l[b].split(/[\/\s]+/),h.length&&"mozilla"!==h[0]&&(a[h[0].split(" ").join("_")]=h.slice(1).join("-"));v.exec(c)?
(a.mobile=RegExp.$1,r.exec(c)&&(delete a[a.mobile],a.blackberry=a.version||RegExp.$3||RegExp.$2||RegExp.$1,RegExp.$1?a.mobile="blackberry":"0.0.1"===a.version&&(a.blackberry="7.1.0.0"))):u.exec(c)?a.desktop=RegExp.$1:w.exec(c)&&(a.game=RegExp.$1,b=a.game.split(" ").join("_"),a.version&&!a[b]&&(a[b]=a.version));a.intel_mac_os_x?(a.mac_os_x=a.intel_mac_os_x.split("_").join("."),delete a.intel_mac_os_x):a.cpu_iphone_os?(a.ios=a.cpu_iphone_os.split("_").join("."),delete a.cpu_iphone_os):a.cpu_os?(a.ios=
a.cpu_os.split("_").join("."),delete a.cpu_os):"iphone"!==a.mobile||a.ios||(a.ios="1");a.opera&&a.version?(a.opera=a.version,delete a.blackberry):s.exec(c)?a.silk_accelerated=!0:t.exec(c)&&(a.fluidapp=a.version);if(a.applewebkit)a.webkit=a.applewebkit,delete a.applewebkit,a.opr&&(a.opera=a.opr,delete a.opr,delete a.chrome),a.safari&&(a.chrome||a.crios||a.opera||a.silk||a.fluidapp||a.phantomjs||a.mobile&&!a.ios?delete a.safari:a.safari=a.version&&!a.rim_tablet_os?a.version:{419:"2.0.4",417:"2.0.3",
416:"2.0.2",412:"2.0",312:"1.3",125:"1.2",85:"1.0"}[parseInt(a.safari,10)]||a.safari);else if(a.msie||a.trident)if(a.opera||(a.ie=a.msie||a.rv),delete a.msie,a.windows_phone_os)a.windows_phone=a.windows_phone_os,delete a.windows_phone_os;else{if("wpdesktop"===a.mobile||"xblwp7"===a.mobile||"zunewp7"===a.mobile)a.mobile="windows desktop",a.windows_phone=9>+a.ie?"7.0":10>+a.ie?"7.5":"8.0",delete a.windows_nt}else if(a.gecko||a.firefox)a.gecko=a.rv;a.rv&&delete a.rv;a.version&&delete a.version;return a},
format:function(c){var a="",b;for(b in c)if(b&&c.hasOwnProperty(b)){var g=b,e=c[b],g=g.split(".").join("-"),f=" ua-"+g;if("string"===typeof e){for(var e=e.split(" ").join("_").split(".").join("-"),d=e.indexOf("-");0<d;)f+=" ua-"+g+"-"+e.substring(0,d),d=e.indexOf("-",d+1);f+=" ua-"+g+"-"+e}a+=f}return a},encode:function(c){var a="",b;for(b in c)b&&c.hasOwnProperty(b)&&(a&&(a+="\x26"),a+=encodeURIComponent(b)+"\x3d"+encodeURIComponent(c[b]));return a}};d.userAgent=d.ua=d.parse(n);var m=d.format(d.ua)+
" js";k.className=k.className?k.className.replace(/\bno-js\b/g,"")+m:m.substr(1);return d}(document.documentElement,navigator.userAgent);
var metas = document.getElementsByTagName('meta');
var i;
if (navigator.userAgent.match(/iPhone/i)) {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
    }
  }
  document.addEventListener("gesturestart", gestureStart, false);
}
function gestureStart() {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
    }
  }
}
/*! jQuery v2.0.3 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
*/
(function(e,undefined){var t,n,r=typeof undefined,i=e.location,o=e.document,s=o.documentElement,a=e.jQuery,u=e.$,l={},c=[],p="2.0.3",f=c.concat,h=c.push,d=c.slice,g=c.indexOf,m=l.toString,y=l.hasOwnProperty,v=p.trim,x=function(e,n){return new x.fn.init(e,n,t)},b=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,w=/\S+/g,T=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/^-ms-/,N=/-([\da-z])/gi,E=function(e,t){return t.toUpperCase()},S=function(){o.removeEventListener("DOMContentLoaded",S,!1),e.removeEventListener("load",S,!1),x.ready()};x.fn=x.prototype={jquery:p,constructor:x,init:function(e,t,n){var r,i;if(!e)return this;if("string"==typeof e){if(r="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:T.exec(e),!r||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof x?t[0]:t,x.merge(this,x.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:o,!0)),C.test(r[1])&&x.isPlainObject(t))for(r in t)x.isFunction(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return i=o.getElementById(r[2]),i&&i.parentNode&&(this.length=1,this[0]=i),this.context=o,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?n.ready(e):(e.selector!==undefined&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return d.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,t,n,r,i,o,s=arguments[0]||{},a=1,u=arguments.length,l=!1;for("boolean"==typeof s&&(l=s,s=arguments[1]||{},a=2),"object"==typeof s||x.isFunction(s)||(s={}),u===a&&(s=this,--a);u>a;a++)if(null!=(e=arguments[a]))for(t in e)n=s[t],r=e[t],s!==r&&(l&&r&&(x.isPlainObject(r)||(i=x.isArray(r)))?(i?(i=!1,o=n&&x.isArray(n)?n:[]):o=n&&x.isPlainObject(n)?n:{},s[t]=x.extend(l,o,r)):r!==undefined&&(s[t]=r));return s},x.extend({expando:"jQuery"+(p+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=a),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){(e===!0?--x.readyWait:x.isReady)||(x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(o,[x]),x.fn.trigger&&x(o).trigger("ready").off("ready")))},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray,isWindow:function(e){return null!=e&&e===e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[m.call(e)]||"object":typeof e},isPlainObject:function(e){if("object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!y.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}return!0},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||o;var r=C.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:JSON.parse,parseXML:function(e){var t,n;if(!e||"string"!=typeof e)return null;try{n=new DOMParser,t=n.parseFromString(e,"text/xml")}catch(r){t=undefined}return(!t||t.getElementsByTagName("parsererror").length)&&x.error("Invalid XML: "+e),t},noop:function(){},globalEval:function(e){var t,n=eval;e=x.trim(e),e&&(1===e.indexOf("use strict")?(t=o.createElement("script"),t.text=e,o.head.appendChild(t).parentNode.removeChild(t)):n(e))},camelCase:function(e){return e.replace(k,"ms-").replace(N,E)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,s=j(e);if(n){if(s){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(s){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:function(e){return null==e?"":v.call(e)},makeArray:function(e,t){var n=t||[];return null!=e&&(j(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:g.call(t,e,n)},merge:function(e,t){var n=t.length,r=e.length,i=0;if("number"==typeof n)for(;n>i;i++)e[r++]=t[i];else while(t[i]!==undefined)e[r++]=t[i++];return e.length=r,e},grep:function(e,t,n){var r,i=[],o=0,s=e.length;for(n=!!n;s>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,s=j(e),a=[];if(s)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(a[a.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(a[a.length]=r);return f.apply([],a)},guid:1,proxy:function(e,t){var n,r,i;return"string"==typeof t&&(n=e[t],t=e,e=n),x.isFunction(e)?(r=d.call(arguments,2),i=function(){return e.apply(t||this,r.concat(d.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):undefined},access:function(e,t,n,r,i,o,s){var a=0,u=e.length,l=null==n;if("object"===x.type(n)){i=!0;for(a in n)x.access(e,t,a,n[a],!0,o,s)}else if(r!==undefined&&(i=!0,x.isFunction(r)||(s=!0),l&&(s?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(x(e),n)})),t))for(;u>a;a++)t(e[a],n,s?r:r.call(e[a],a,t(e[a],n)));return i?e:l?t.call(e):u?t(e[0],n):o},now:Date.now,swap:function(e,t,n,r){var i,o,s={};for(o in t)s[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=s[o];return i}}),x.ready.promise=function(t){return n||(n=x.Deferred(),"complete"===o.readyState?setTimeout(x.ready):(o.addEventListener("DOMContentLoaded",S,!1),e.addEventListener("load",S,!1))),n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function j(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}t=x(o),function(e,undefined){var t,n,r,i,o,s,a,u,l,c,p,f,h,d,g,m,y,v="sizzle"+-new Date,b=e.document,w=0,T=0,C=st(),k=st(),N=st(),E=!1,S=function(e,t){return e===t?(E=!0,0):0},j=typeof undefined,D=1<<31,A={}.hasOwnProperty,L=[],q=L.pop,H=L.push,O=L.push,F=L.slice,P=L.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",W="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",$=W.replace("w","w#"),B="\\["+M+"*("+W+")"+M+"*(?:([*^$|!~]?=)"+M+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+$+")|)|)"+M+"*\\]",I=":("+W+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+B.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=RegExp("^"+M+"*,"+M+"*"),X=RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=RegExp(M+"*[+~]"),Y=RegExp("="+M+"*([^\\]'\"]*)"+M+"*\\]","g"),V=RegExp(I),G=RegExp("^"+$+"$"),J={ID:RegExp("^#("+W+")"),CLASS:RegExp("^\\.("+W+")"),TAG:RegExp("^("+W.replace("w","w*")+")"),ATTR:RegExp("^"+B),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:RegExp("^(?:"+R+")$","i"),needsContext:RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Q=/^[^{]+\{\s*\[native \w/,K=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,Z=/^(?:input|select|textarea|button)$/i,et=/^h\d$/i,tt=/'|\\/g,nt=RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),rt=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{O.apply(L=F.call(b.childNodes),b.childNodes),L[b.childNodes.length].nodeType}catch(it){O={apply:L.length?function(e,t){H.apply(e,F.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function ot(e,t,r,i){var o,s,a,u,l,f,g,m,x,w;if((t?t.ownerDocument||t:b)!==p&&c(t),t=t||p,r=r||[],!e||"string"!=typeof e)return r;if(1!==(u=t.nodeType)&&9!==u)return[];if(h&&!i){if(o=K.exec(e))if(a=o[1]){if(9===u){if(s=t.getElementById(a),!s||!s.parentNode)return r;if(s.id===a)return r.push(s),r}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(a))&&y(t,s)&&s.id===a)return r.push(s),r}else{if(o[2])return O.apply(r,t.getElementsByTagName(e)),r;if((a=o[3])&&n.getElementsByClassName&&t.getElementsByClassName)return O.apply(r,t.getElementsByClassName(a)),r}if(n.qsa&&(!d||!d.test(e))){if(m=g=v,x=t,w=9===u&&e,1===u&&"object"!==t.nodeName.toLowerCase()){f=gt(e),(g=t.getAttribute("id"))?m=g.replace(tt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",l=f.length;while(l--)f[l]=m+mt(f[l]);x=U.test(e)&&t.parentNode||t,w=f.join(",")}if(w)try{return O.apply(r,x.querySelectorAll(w)),r}catch(T){}finally{g||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,r,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>i.cacheLength&&delete t[e.shift()],t[n]=r}return t}function at(e){return e[v]=!0,e}function ut(e){var t=p.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function lt(e,t){var n=e.split("|"),r=e.length;while(r--)i.attrHandle[n[r]]=t}function ct(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function pt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return at(function(t){return t=+t,at(function(n,r){var i,o=e([],n.length,t),s=o.length;while(s--)n[i=o[s]]&&(n[i]=!(r[i]=n[i]))})})}s=ot.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},n=ot.support={},c=ot.setDocument=function(e){var t=e?e.ownerDocument||e:b,r=t.defaultView;return t!==p&&9===t.nodeType&&t.documentElement?(p=t,f=t.documentElement,h=!s(t),r&&r.attachEvent&&r!==r.top&&r.attachEvent("onbeforeunload",function(){c()}),n.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ut(function(e){return e.appendChild(t.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),n.getById=ut(function(e){return f.appendChild(e).id=v,!t.getElementsByName||!t.getElementsByName(v).length}),n.getById?(i.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},i.filter.ID=function(e){var t=e.replace(nt,rt);return function(e){return e.getAttribute("id")===t}}):(delete i.find.ID,i.filter.ID=function(e){var t=e.replace(nt,rt);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),i.find.TAG=n.getElementsByTagName?function(e,t){return typeof t.getElementsByTagName!==j?t.getElementsByTagName(e):undefined}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},i.find.CLASS=n.getElementsByClassName&&function(e,t){return typeof t.getElementsByClassName!==j&&h?t.getElementsByClassName(e):undefined},g=[],d=[],(n.qsa=Q.test(t.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||d.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll(":checked").length||d.push(":checked")}),ut(function(e){var n=t.createElement("input");n.setAttribute("type","hidden"),e.appendChild(n).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&d.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||d.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),d.push(",.*:")})),(n.matchesSelector=Q.test(m=f.webkitMatchesSelector||f.mozMatchesSelector||f.oMatchesSelector||f.msMatchesSelector))&&ut(function(e){n.disconnectedMatch=m.call(e,"div"),m.call(e,"[s!='']:x"),g.push("!=",I)}),d=d.length&&RegExp(d.join("|")),g=g.length&&RegExp(g.join("|")),y=Q.test(f.contains)||f.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},S=f.compareDocumentPosition?function(e,r){if(e===r)return E=!0,0;var i=r.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(r);return i?1&i||!n.sortDetached&&r.compareDocumentPosition(e)===i?e===t||y(b,e)?-1:r===t||y(b,r)?1:l?P.call(l,e)-P.call(l,r):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,n){var r,i=0,o=e.parentNode,s=n.parentNode,a=[e],u=[n];if(e===n)return E=!0,0;if(!o||!s)return e===t?-1:n===t?1:o?-1:s?1:l?P.call(l,e)-P.call(l,n):0;if(o===s)return ct(e,n);r=e;while(r=r.parentNode)a.unshift(r);r=n;while(r=r.parentNode)u.unshift(r);while(a[i]===u[i])i++;return i?ct(a[i],u[i]):a[i]===b?-1:u[i]===b?1:0},t):p},ot.matches=function(e,t){return ot(e,null,null,t)},ot.matchesSelector=function(e,t){if((e.ownerDocument||e)!==p&&c(e),t=t.replace(Y,"='$1']"),!(!n.matchesSelector||!h||g&&g.test(t)||d&&d.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(i){}return ot(t,p,null,[e]).length>0},ot.contains=function(e,t){return(e.ownerDocument||e)!==p&&c(e),y(e,t)},ot.attr=function(e,t){(e.ownerDocument||e)!==p&&c(e);var r=i.attrHandle[t.toLowerCase()],o=r&&A.call(i.attrHandle,t.toLowerCase())?r(e,t,!h):undefined;return o===undefined?n.attributes||!h?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null:o},ot.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},ot.uniqueSort=function(e){var t,r=[],i=0,o=0;if(E=!n.detectDuplicates,l=!n.sortStable&&e.slice(0),e.sort(S),E){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return e},o=ot.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=o(t);return n},i=ot.selectors={cacheLength:50,createPseudo:at,match:J,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(nt,rt),e[3]=(e[4]||e[5]||"").replace(nt,rt),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||ot.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&ot.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return J.CHILD.test(e[0])?null:(e[3]&&e[4]!==undefined?e[2]=e[4]:n&&V.test(n)&&(t=gt(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(nt,rt).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=C[e+" "];return t||(t=RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&C(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=ot.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,p,f,h,d,g=o!==s?"nextSibling":"previousSibling",m=t.parentNode,y=a&&t.nodeName.toLowerCase(),x=!u&&!a;if(m){if(o){while(g){p=t;while(p=p[g])if(a?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;d=g="only"===e&&!d&&"nextSibling"}return!0}if(d=[s?m.firstChild:m.lastChild],s&&x){c=m[v]||(m[v]={}),l=c[e]||[],h=l[0]===w&&l[1],f=l[0]===w&&l[2],p=h&&m.childNodes[h];while(p=++h&&p&&p[g]||(f=h=0)||d.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[w,h,f];break}}else if(x&&(l=(t[v]||(t[v]={}))[e])&&l[0]===w)f=l[1];else while(p=++h&&p&&p[g]||(f=h=0)||d.pop())if((a?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(x&&((p[v]||(p[v]={}))[e]=[w,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||ot.error("unsupported pseudo: "+e);return r[v]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?at(function(e,n){var i,o=r(e,t),s=o.length;while(s--)i=P.call(e,o[s]),e[i]=!(n[i]=o[s])}):function(e){return r(e,0,n)}):r}},pseudos:{not:at(function(e){var t=[],n=[],r=a(e.replace(z,"$1"));return r[v]?at(function(e,t,n,i){var o,s=r(e,null,i,[]),a=e.length;while(a--)(o=s[a])&&(e[a]=!(t[a]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:at(function(e){return function(t){return ot(e,t).length>0}}),contains:at(function(e){return function(t){return(t.textContent||t.innerText||o(t)).indexOf(e)>-1}}),lang:at(function(e){return G.test(e||"")||ot.error("unsupported lang: "+e),e=e.replace(nt,rt).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===f},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!i.pseudos.empty(e)},header:function(e){return et.test(e.nodeName)},input:function(e){return Z.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},i.pseudos.nth=i.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})i.pseudos[t]=pt(t);for(t in{submit:!0,reset:!0})i.pseudos[t]=ft(t);function dt(){}dt.prototype=i.filters=i.pseudos,i.setFilters=new dt;function gt(e,t){var n,r,o,s,a,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);a=e,u=[],l=i.preFilter;while(a){(!n||(r=_.exec(a)))&&(r&&(a=a.slice(r[0].length)||a),u.push(o=[])),n=!1,(r=X.exec(a))&&(n=r.shift(),o.push({value:n,type:r[0].replace(z," ")}),a=a.slice(n.length));for(s in i.filter)!(r=J[s].exec(a))||l[s]&&!(r=l[s](r))||(n=r.shift(),o.push({value:n,type:s,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?ot.error(e):k(e,u).slice(0)}function mt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function yt(e,t,n){var i=t.dir,o=n&&"parentNode"===i,s=T++;return t.first?function(t,n,r){while(t=t[i])if(1===t.nodeType||o)return e(t,n,r)}:function(t,n,a){var u,l,c,p=w+" "+s;if(a){while(t=t[i])if((1===t.nodeType||o)&&e(t,n,a))return!0}else while(t=t[i])if(1===t.nodeType||o)if(c=t[v]||(t[v]={}),(l=c[i])&&l[0]===p){if((u=l[1])===!0||u===r)return u===!0}else if(l=c[i]=[p],l[1]=e(t,n,a)||r,l[1]===!0)return!0}}function vt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,s=[],a=0,u=e.length,l=null!=t;for(;u>a;a++)(o=e[a])&&(!n||n(o,r,i))&&(s.push(o),l&&t.push(a));return s}function bt(e,t,n,r,i,o){return r&&!r[v]&&(r=bt(r)),i&&!i[v]&&(i=bt(i,o)),at(function(o,s,a,u){var l,c,p,f=[],h=[],d=s.length,g=o||Ct(t||"*",a.nodeType?[a]:a,[]),m=!e||!o&&t?g:xt(g,f,e,a,u),y=n?i||(o?e:d||r)?[]:s:m;if(n&&n(m,y,a,u),r){l=xt(y,h),r(l,[],a,u),c=l.length;while(c--)(p=l[c])&&(y[h[c]]=!(m[h[c]]=p))}if(o){if(i||e){if(i){l=[],c=y.length;while(c--)(p=y[c])&&l.push(m[c]=p);i(null,y=[],l,u)}c=y.length;while(c--)(p=y[c])&&(l=i?P.call(o,p):f[c])>-1&&(o[l]=!(s[l]=p))}}else y=xt(y===s?y.splice(d,y.length):y),i?i(null,s,y,u):O.apply(s,y)})}function wt(e){var t,n,r,o=e.length,s=i.relative[e[0].type],a=s||i.relative[" "],l=s?1:0,c=yt(function(e){return e===t},a,!0),p=yt(function(e){return P.call(t,e)>-1},a,!0),f=[function(e,n,r){return!s&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;o>l;l++)if(n=i.relative[e[l].type])f=[yt(vt(f),n)];else{if(n=i.filter[e[l].type].apply(null,e[l].matches),n[v]){for(r=++l;o>r;r++)if(i.relative[e[r].type])break;return bt(l>1&&vt(f),l>1&&mt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&wt(e.slice(l,r)),o>r&&wt(e=e.slice(r)),o>r&&mt(e))}f.push(n)}return vt(f)}function Tt(e,t){var n=0,o=t.length>0,s=e.length>0,a=function(a,l,c,f,h){var d,g,m,y=[],v=0,x="0",b=a&&[],T=null!=h,C=u,k=a||s&&i.find.TAG("*",h&&l.parentNode||l),N=w+=null==C?1:Math.random()||.1;for(T&&(u=l!==p&&l,r=n);null!=(d=k[x]);x++){if(s&&d){g=0;while(m=e[g++])if(m(d,l,c)){f.push(d);break}T&&(w=N,r=++n)}o&&((d=!m&&d)&&v--,a&&b.push(d))}if(v+=x,o&&x!==v){g=0;while(m=t[g++])m(b,y,l,c);if(a){if(v>0)while(x--)b[x]||y[x]||(y[x]=q.call(f));y=xt(y)}O.apply(f,y),T&&!a&&y.length>0&&v+t.length>1&&ot.uniqueSort(f)}return T&&(w=N,u=C),b};return o?at(a):a}a=ot.compile=function(e,t){var n,r=[],i=[],o=N[e+" "];if(!o){t||(t=gt(e)),n=t.length;while(n--)o=wt(t[n]),o[v]?r.push(o):i.push(o);o=N(e,Tt(i,r))}return o};function Ct(e,t,n){var r=0,i=t.length;for(;i>r;r++)ot(e,t[r],n);return n}function kt(e,t,r,o){var s,u,l,c,p,f=gt(e);if(!o&&1===f.length){if(u=f[0]=f[0].slice(0),u.length>2&&"ID"===(l=u[0]).type&&n.getById&&9===t.nodeType&&h&&i.relative[u[1].type]){if(t=(i.find.ID(l.matches[0].replace(nt,rt),t)||[])[0],!t)return r;e=e.slice(u.shift().value.length)}s=J.needsContext.test(e)?0:u.length;while(s--){if(l=u[s],i.relative[c=l.type])break;if((p=i.find[c])&&(o=p(l.matches[0].replace(nt,rt),U.test(u[0].type)&&t.parentNode||t))){if(u.splice(s,1),e=o.length&&mt(u),!e)return O.apply(r,o),r;break}}}return a(e,f)(o,t,!h,r,U.test(e)),r}n.sortStable=v.split("").sort(S).join("")===v,n.detectDuplicates=E,c(),n.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(p.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||lt("type|href|height|width",function(e,t,n){return n?undefined:e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||lt("value",function(e,t,n){return n||"input"!==e.nodeName.toLowerCase()?undefined:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||lt(R,function(e,t,n){var r;return n?undefined:(r=e.getAttributeNode(t))&&r.specified?r.value:e[t]===!0?t.toLowerCase():null}),x.find=ot,x.expr=ot.selectors,x.expr[":"]=x.expr.pseudos,x.unique=ot.uniqueSort,x.text=ot.getText,x.isXMLDoc=ot.isXML,x.contains=ot.contains}(e);var D={};function A(e){var t=D[e]={};return x.each(e.match(w)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?D[e]||A(e):x.extend({},e);var t,n,r,i,o,s,a=[],u=!e.once&&[],l=function(p){for(t=e.memory&&p,n=!0,s=i||0,i=0,o=a.length,r=!0;a&&o>s;s++)if(a[s].apply(p[0],p[1])===!1&&e.stopOnFalse){t=!1;break}r=!1,a&&(u?u.length&&l(u.shift()):t?a=[]:c.disable())},c={add:function(){if(a){var n=a.length;(function s(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&c.has(n)||a.push(n):n&&n.length&&"string"!==r&&s(n)})})(arguments),r?o=a.length:t&&(i=n,l(t))}return this},remove:function(){return a&&x.each(arguments,function(e,t){var n;while((n=x.inArray(t,a,n))>-1)a.splice(n,1),r&&(o>=n&&o--,s>=n&&s--)}),this},has:function(e){return e?x.inArray(e,a)>-1:!(!a||!a.length)},empty:function(){return a=[],o=0,this},disable:function(){return a=u=t=undefined,this},disabled:function(){return!a},lock:function(){return u=undefined,t||c.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!a||n&&!u||(t=t||[],t=[e,t.slice?t.slice():t],r?u.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!n}};return c},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var s=o[0],a=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=a&&a.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===r?n.promise():this,a?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var s=o[2],a=o[3];r[o[1]]=s.add,a&&s.add(function(){n=a},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=s.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=d.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),s=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?d.call(arguments):r,n===a?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},a,u,l;if(r>1)for(a=Array(r),u=Array(r),l=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(s(t,l,n)).fail(o.reject).progress(s(t,u,a)):--i;return i||o.resolveWith(l,n),o.promise()}}),x.support=function(t){var n=o.createElement("input"),r=o.createDocumentFragment(),i=o.createElement("div"),s=o.createElement("select"),a=s.appendChild(o.createElement("option"));return n.type?(n.type="checkbox",t.checkOn=""!==n.value,t.optSelected=a.selected,t.reliableMarginRight=!0,t.boxSizingReliable=!0,t.pixelPosition=!1,n.checked=!0,t.noCloneChecked=n.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!a.disabled,n=o.createElement("input"),n.value="t",n.type="radio",t.radioValue="t"===n.value,n.setAttribute("checked","t"),n.setAttribute("name","t"),r.appendChild(n),t.checkClone=r.cloneNode(!0).cloneNode(!0).lastChild.checked,t.focusinBubbles="onfocusin"in e,i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===i.style.backgroundClip,x(function(){var n,r,s="padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",a=o.getElementsByTagName("body")[0];a&&(n=o.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",a.appendChild(n).appendChild(i),i.innerHTML="",i.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%",x.swap(a,null!=a.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===i.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(i,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(i,null)||{width:"4px"}).width,r=i.appendChild(o.createElement("div")),r.style.cssText=i.style.cssText=s,r.style.marginRight=r.style.width="0",i.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),a.removeChild(n))}),t):t}({});var L,q,H=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,O=/([A-Z])/g;function F(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=x.expando+Math.random()}F.uid=1,F.accepts=function(e){return e.nodeType?1===e.nodeType||9===e.nodeType:!0},F.prototype={key:function(e){if(!F.accepts(e))return 0;var t={},n=e[this.expando];if(!n){n=F.uid++;try{t[this.expando]={value:n},Object.defineProperties(e,t)}catch(r){t[this.expando]=n,x.extend(e,t)}}return this.cache[n]||(this.cache[n]={}),n},set:function(e,t,n){var r,i=this.key(e),o=this.cache[i];if("string"==typeof t)o[t]=n;else if(x.isEmptyObject(o))x.extend(this.cache[i],t);else for(r in t)o[r]=t[r];return o},get:function(e,t){var n=this.cache[this.key(e)];return t===undefined?n:n[t]},access:function(e,t,n){var r;return t===undefined||t&&"string"==typeof t&&n===undefined?(r=this.get(e,t),r!==undefined?r:this.get(e,x.camelCase(t))):(this.set(e,t,n),n!==undefined?n:t)},remove:function(e,t){var n,r,i,o=this.key(e),s=this.cache[o];if(t===undefined)this.cache[o]={};else{x.isArray(t)?r=t.concat(t.map(x.camelCase)):(i=x.camelCase(t),t in s?r=[t,i]:(r=i,r=r in s?[r]:r.match(w)||[])),n=r.length;while(n--)delete s[r[n]]}},hasData:function(e){return!x.isEmptyObject(this.cache[e[this.expando]]||{})},discard:function(e){e[this.expando]&&delete this.cache[e[this.expando]]}},L=new F,q=new F,x.extend({acceptData:F.accepts,hasData:function(e){return L.hasData(e)||q.hasData(e)},data:function(e,t,n){return L.access(e,t,n)},removeData:function(e,t){L.remove(e,t)},_data:function(e,t,n){return q.access(e,t,n)},_removeData:function(e,t){q.remove(e,t)}}),x.fn.extend({data:function(e,t){var n,r,i=this[0],o=0,s=null;if(e===undefined){if(this.length&&(s=L.get(i),1===i.nodeType&&!q.get(i,"hasDataAttrs"))){for(n=i.attributes;n.length>o;o++)r=n[o].name,0===r.indexOf("data-")&&(r=x.camelCase(r.slice(5)),P(i,r,s[r]));q.set(i,"hasDataAttrs",!0)}return s}return"object"==typeof e?this.each(function(){L.set(this,e)}):x.access(this,function(t){var n,r=x.camelCase(e);if(i&&t===undefined){if(n=L.get(i,e),n!==undefined)return n;if(n=L.get(i,r),n!==undefined)return n;if(n=P(i,r,undefined),n!==undefined)return n}else this.each(function(){var n=L.get(this,r);L.set(this,r,t),-1!==e.indexOf("-")&&n!==undefined&&L.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){L.remove(this,e)})}});function P(e,t,n){var r;if(n===undefined&&1===e.nodeType)if(r="data-"+t.replace(O,"-$1").toLowerCase(),n=e.getAttribute(r),"string"==typeof n){try{n="true"===n?!0:"false"===n?!1:"null"===n?null:+n+""===n?+n:H.test(n)?JSON.parse(n):n}catch(i){}L.set(e,t,n)}else n=undefined;return n}x.extend({queue:function(e,t,n){var r;return e?(t=(t||"fx")+"queue",r=q.get(e,t),n&&(!r||x.isArray(n)?r=q.access(e,t,x.makeArray(n)):r.push(n)),r||[]):undefined},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),s=function(){x.dequeue(e,t)
};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,s,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return q.get(e,n)||q.access(e,n,{empty:x.Callbacks("once memory").add(function(){q.remove(e,[t+"queue",n])})})}}),x.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),n>arguments.length?x.queue(this[0],e):t===undefined?this:this.each(function(){var n=x.queue(this,e,t);x._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=x.Deferred(),o=this,s=this.length,a=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=undefined),e=e||"fx";while(s--)n=q.get(o[s],e+"queueHooks"),n&&n.empty&&(r++,n.empty.add(a));return a(),i.promise(t)}});var R,M,W=/[\t\r\n\f]/g,$=/\r/g,B=/^(?:input|select|textarea|button)$/i;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[x.propFix[e]||e]})},addClass:function(e){var t,n,r,i,o,s=0,a=this.length,u="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,s=0,a=this.length,u=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,i=0,o=x(this),s=e.match(w)||[];while(t=s[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===r||"boolean"===n)&&(this.className&&q.set(this,"__className__",this.className),this.className=this.className||e===!1?"":q.get(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(W," ").indexOf(t)>=0)return!0;return!1},val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=x.isFunction(e),this.each(function(n){var i;1===this.nodeType&&(i=r?e.call(this,n,x(this).val()):e,null==i?i="":"number"==typeof i?i+="":x.isArray(i)&&(i=x.map(i,function(e){return null==e?"":e+""})),t=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],t&&"set"in t&&t.set(this,i,"value")!==undefined||(this.value=i))});if(i)return t=x.valHooks[i.type]||x.valHooks[i.nodeName.toLowerCase()],t&&"get"in t&&(n=t.get(i,"value"))!==undefined?n:(n=i.value,"string"==typeof n?n.replace($,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,s=o?null:[],a=o?i+1:r.length,u=0>i?a:o?i:0;for(;a>u;u++)if(n=r[u],!(!n.selected&&u!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),s=i.length;while(s--)r=i[s],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,t,n){var i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===r?x.prop(e,t,n):(1===s&&x.isXMLDoc(e)||(t=t.toLowerCase(),i=x.attrHooks[t]||(x.expr.match.bool.test(t)?M:R)),n===undefined?i&&"get"in i&&null!==(o=i.get(e,t))?o:(o=x.find.attr(e,t),null==o?undefined:o):null!==n?i&&"set"in i&&(o=i.set(e,n,t))!==undefined?o:(e.setAttribute(t,n+""),n):(x.removeAttr(e,t),undefined))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(w);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)&&(e[r]=!1),e.removeAttribute(n)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,t,n){var r,i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return o=1!==s||!x.isXMLDoc(e),o&&(t=x.propFix[t]||t,i=x.propHooks[t]),n!==undefined?i&&"set"in i&&(r=i.set(e,n,t))!==undefined?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){return e.hasAttribute("tabindex")||B.test(e.nodeName)||e.href?e.tabIndex:-1}}}}),M={set:function(e,t,n){return t===!1?x.removeAttr(e,n):e.setAttribute(n,n),n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,t){var n=x.expr.attrHandle[t]||x.find.attr;x.expr.attrHandle[t]=function(e,t,r){var i=x.expr.attrHandle[t],o=r?undefined:(x.expr.attrHandle[t]=undefined)!=n(e,t,r)?t.toLowerCase():null;return x.expr.attrHandle[t]=i,o}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,t){return x.isArray(t)?e.checked=x.inArray(x(e).val(),t)>=0:undefined}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var I=/^key/,z=/^(?:mouse|contextmenu)|click/,_=/^(?:focusinfocus|focusoutblur)$/,X=/^([^.]*)(?:\.(.+)|)$/;function U(){return!0}function Y(){return!1}function V(){try{return o.activeElement}catch(e){}}x.event={global:{},add:function(e,t,n,i,o){var s,a,u,l,c,p,f,h,d,g,m,y=q.get(e);if(y){n.handler&&(s=n,n=s.handler,o=s.selector),n.guid||(n.guid=x.guid++),(l=y.events)||(l=y.events={}),(a=y.handle)||(a=y.handle=function(e){return typeof x===r||e&&x.event.triggered===e.type?undefined:x.event.dispatch.apply(a.elem,arguments)},a.elem=e),t=(t||"").match(w)||[""],c=t.length;while(c--)u=X.exec(t[c])||[],d=m=u[1],g=(u[2]||"").split(".").sort(),d&&(f=x.event.special[d]||{},d=(o?f.delegateType:f.bindType)||d,f=x.event.special[d]||{},p=x.extend({type:d,origType:m,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&x.expr.match.needsContext.test(o),namespace:g.join(".")},s),(h=l[d])||(h=l[d]=[],h.delegateCount=0,f.setup&&f.setup.call(e,i,g,a)!==!1||e.addEventListener&&e.addEventListener(d,a,!1)),f.add&&(f.add.call(e,p),p.handler.guid||(p.handler.guid=n.guid)),o?h.splice(h.delegateCount++,0,p):h.push(p),x.event.global[d]=!0);e=null}},remove:function(e,t,n,r,i){var o,s,a,u,l,c,p,f,h,d,g,m=q.hasData(e)&&q.get(e);if(m&&(u=m.events)){t=(t||"").match(w)||[""],l=t.length;while(l--)if(a=X.exec(t[l])||[],h=g=a[1],d=(a[2]||"").split(".").sort(),h){p=x.event.special[h]||{},h=(r?p.delegateType:p.bindType)||h,f=u[h]||[],a=a[2]&&RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=o=f.length;while(o--)c=f[o],!i&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(f.splice(o,1),c.selector&&f.delegateCount--,p.remove&&p.remove.call(e,c));s&&!f.length&&(p.teardown&&p.teardown.call(e,d,m.handle)!==!1||x.removeEvent(e,h,m.handle),delete u[h])}else for(h in u)x.event.remove(e,h+t[l],n,r,!0);x.isEmptyObject(u)&&(delete m.handle,q.remove(e,"events"))}},trigger:function(t,n,r,i){var s,a,u,l,c,p,f,h=[r||o],d=y.call(t,"type")?t.type:t,g=y.call(t,"namespace")?t.namespace.split("."):[];if(a=u=r=r||o,3!==r.nodeType&&8!==r.nodeType&&!_.test(d+x.event.triggered)&&(d.indexOf(".")>=0&&(g=d.split("."),d=g.shift(),g.sort()),c=0>d.indexOf(":")&&"on"+d,t=t[x.expando]?t:new x.Event(d,"object"==typeof t&&t),t.isTrigger=i?2:3,t.namespace=g.join("."),t.namespace_re=t.namespace?RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=undefined,t.target||(t.target=r),n=null==n?[t]:x.makeArray(n,[t]),f=x.event.special[d]||{},i||!f.trigger||f.trigger.apply(r,n)!==!1)){if(!i&&!f.noBubble&&!x.isWindow(r)){for(l=f.delegateType||d,_.test(l+d)||(a=a.parentNode);a;a=a.parentNode)h.push(a),u=a;u===(r.ownerDocument||o)&&h.push(u.defaultView||u.parentWindow||e)}s=0;while((a=h[s++])&&!t.isPropagationStopped())t.type=s>1?l:f.bindType||d,p=(q.get(a,"events")||{})[t.type]&&q.get(a,"handle"),p&&p.apply(a,n),p=c&&a[c],p&&x.acceptData(a)&&p.apply&&p.apply(a,n)===!1&&t.preventDefault();return t.type=d,i||t.isDefaultPrevented()||f._default&&f._default.apply(h.pop(),n)!==!1||!x.acceptData(r)||c&&x.isFunction(r[d])&&!x.isWindow(r)&&(u=r[c],u&&(r[c]=null),x.event.triggered=d,r[d](),x.event.triggered=undefined,u&&(r[c]=u)),t.result}},dispatch:function(e){e=x.event.fix(e);var t,n,r,i,o,s=[],a=d.call(arguments),u=(q.get(this,"events")||{})[e.type]||[],l=x.event.special[e.type]||{};if(a[0]=e,e.delegateTarget=this,!l.preDispatch||l.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),t=0;while((i=s[t++])&&!e.isPropagationStopped()){e.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(o.namespace))&&(e.handleObj=o,e.data=o.data,r=((x.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,a),r!==undefined&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,s=[],a=t.delegateCount,u=e.target;if(a&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!==this;u=u.parentNode||this)if(u.disabled!==!0||"click"!==e.type){for(r=[],n=0;a>n;n++)o=t[n],i=o.selector+" ",r[i]===undefined&&(r[i]=o.needsContext?x(i,this).index(u)>=0:x.find(i,this,null,[u]).length),r[i]&&r.push(o);r.length&&s.push({elem:u,handlers:r})}return t.length>a&&s.push({elem:this,handlers:t.slice(a)}),s},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,s=t.button;return null==e.pageX&&null!=t.clientX&&(n=e.target.ownerDocument||o,r=n.documentElement,i=n.body,e.pageX=t.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=t.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),e.which||s===undefined||(e.which=1&s?1:2&s?3:4&s?2:0),e}},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,s=e,a=this.fixHooks[i];a||(this.fixHooks[i]=a=z.test(i)?this.mouseHooks:I.test(i)?this.keyHooks:{}),r=a.props?this.props.concat(a.props):this.props,e=new x.Event(s),t=r.length;while(t--)n=r[t],e[n]=s[n];return e.target||(e.target=o),3===e.target.nodeType&&(e.target=e.target.parentNode),a.filter?a.filter(e,s):e},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==V()&&this.focus?(this.focus(),!1):undefined},delegateType:"focusin"},blur:{trigger:function(){return this===V()&&this.blur?(this.blur(),!1):undefined},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&x.nodeName(this,"input")?(this.click(),!1):undefined},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==undefined&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)},x.Event=function(e,t){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.getPreventDefault&&e.getPreventDefault()?U:Y):this.type=e,t&&x.extend(this,t),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,undefined):new x.Event(e,t)},x.Event.prototype={isDefaultPrevented:Y,isPropagationStopped:Y,isImmediatePropagationStopped:Y,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=U,e&&e.preventDefault&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=U,e&&e.stopPropagation&&e.stopPropagation()},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=U,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&o.addEventListener(e,r,!0)},teardown:function(){0===--n&&o.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,t,n,r,i){var o,s;if("object"==typeof e){"string"!=typeof t&&(n=n||t,t=undefined);for(s in e)this.on(s,t,n,e[s],i);return this}if(null==n&&null==r?(r=t,n=t=undefined):null==r&&("string"==typeof t?(r=n,n=undefined):(r=n,n=t,t=undefined)),r===!1)r=Y;else if(!r)return this;return 1===i&&(o=r,r=function(e){return x().off(e),o.apply(this,arguments)},r.guid=o.guid||(o.guid=x.guid++)),this.each(function(){x.event.add(this,e,r,n,t)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,x(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return(t===!1||"function"==typeof t)&&(n=t,t=undefined),n===!1&&(n=Y),this.each(function(){x.event.remove(this,e,n,t)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];return n?x.event.trigger(e,t,n,!0):undefined}});var G=/^.[^:#\[\.,]*$/,J=/^(?:parents|prev(?:Until|All))/,Q=x.expr.match.needsContext,K={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t=x(e,this),n=t.length;return this.filter(function(){var e=0;for(;n>e;e++)if(x.contains(this,t[e]))return!0})},not:function(e){return this.pushStack(et(this,e||[],!0))},filter:function(e){return this.pushStack(et(this,e||[],!1))},is:function(e){return!!et(this,"string"==typeof e&&Q.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],s=Q.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(s?s.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?g.call(x(e),this[0]):g.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function Z(e,t){while((e=e[t])&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return Z(e,"nextSibling")},prev:function(e){return Z(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return e.contentDocument||x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(K[e]||x.unique(i),J.test(e)&&i.reverse()),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,t,n){var r=[],i=n!==undefined;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&x(e).is(n))break;r.push(e)}return r},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function et(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(G.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return g.call(t,e)>=0!==n})}var tt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,nt=/<([\w:]+)/,rt=/<|&#?\w+;/,it=/<(?:script|style|link)/i,ot=/^(?:checkbox|radio)$/i,st=/checked\s*(?:[^=]|=\s*.checked.)/i,at=/^$|\/(?:java|ecma)script/i,ut=/^true\/(.*)/,lt=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ct={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ct.optgroup=ct.option,ct.tbody=ct.tfoot=ct.colgroup=ct.caption=ct.thead,ct.th=ct.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===undefined?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||o).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=pt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=pt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(mt(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&dt(mt(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++)1===e.nodeType&&(x.cleanData(mt(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var t=this[0]||{},n=0,r=this.length;if(e===undefined&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!it.test(e)&&!ct[(nt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(tt,"<$1></$2>");try{for(;r>n;n++)t=this[n]||{},1===t.nodeType&&(x.cleanData(mt(t,!1)),t.innerHTML=e);t=0}catch(i){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=f.apply([],e);var r,i,o,s,a,u,l=0,c=this.length,p=this,h=c-1,d=e[0],g=x.isFunction(d);if(g||!(1>=c||"string"!=typeof d||x.support.checkClone)&&st.test(d))return this.each(function(r){var i=p.eq(r);g&&(e[0]=d.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(r=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),i=r.firstChild,1===r.childNodes.length&&(r=i),i)){for(o=x.map(mt(r,"script"),ft),s=o.length;c>l;l++)a=r,l!==h&&(a=x.clone(a,!0,!0),s&&x.merge(o,mt(a,"script"))),t.call(this[l],a,l);if(s)for(u=o[o.length-1].ownerDocument,x.map(o,ht),l=0;s>l;l++)a=o[l],at.test(a.type||"")&&!q.access(a,"globalEval")&&x.contains(u,a)&&(a.src?x._evalUrl(a.src):x.globalEval(a.textContent.replace(lt,"")))}return this}}),x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=[],i=x(e),o=i.length-1,s=0;for(;o>=s;s++)n=s===o?this:this.clone(!0),x(i[s])[t](n),h.apply(r,n.get());return this.pushStack(r)}}),x.extend({clone:function(e,t,n){var r,i,o,s,a=e.cloneNode(!0),u=x.contains(e.ownerDocument,e);if(!(x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(s=mt(a),o=mt(e),r=0,i=o.length;i>r;r++)yt(o[r],s[r]);if(t)if(n)for(o=o||mt(e),s=s||mt(a),r=0,i=o.length;i>r;r++)gt(o[r],s[r]);else gt(e,a);return s=mt(a,"script"),s.length>0&&dt(s,!u&&mt(e,"script")),a},buildFragment:function(e,t,n,r){var i,o,s,a,u,l,c=0,p=e.length,f=t.createDocumentFragment(),h=[];for(;p>c;c++)if(i=e[c],i||0===i)if("object"===x.type(i))x.merge(h,i.nodeType?[i]:i);else if(rt.test(i)){o=o||f.appendChild(t.createElement("div")),s=(nt.exec(i)||["",""])[1].toLowerCase(),a=ct[s]||ct._default,o.innerHTML=a[1]+i.replace(tt,"<$1></$2>")+a[2],l=a[0];while(l--)o=o.lastChild;x.merge(h,o.childNodes),o=f.firstChild,o.textContent=""}else h.push(t.createTextNode(i));f.textContent="",c=0;while(i=h[c++])if((!r||-1===x.inArray(i,r))&&(u=x.contains(i.ownerDocument,i),o=mt(f.appendChild(i),"script"),u&&dt(o),n)){l=0;while(i=o[l++])at.test(i.type||"")&&n.push(i)}return f},cleanData:function(e){var t,n,r,i,o,s,a=x.event.special,u=0;for(;(n=e[u])!==undefined;u++){if(F.accepts(n)&&(o=n[q.expando],o&&(t=q.cache[o]))){if(r=Object.keys(t.events||{}),r.length)for(s=0;(i=r[s])!==undefined;s++)a[i]?x.event.remove(n,i):x.removeEvent(n,i,t.handle);q.cache[o]&&delete q.cache[o]}delete L.cache[n[L.expando]]}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}});function pt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function ft(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function ht(e){var t=ut.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function dt(e,t){var n=e.length,r=0;for(;n>r;r++)q.set(e[r],"globalEval",!t||q.get(t[r],"globalEval"))}function gt(e,t){var n,r,i,o,s,a,u,l;if(1===t.nodeType){if(q.hasData(e)&&(o=q.access(e),s=q.set(t,o),l=o.events)){delete s.handle,s.events={};for(i in l)for(n=0,r=l[i].length;r>n;n++)x.event.add(t,i,l[i][n])}L.hasData(e)&&(a=L.access(e),u=x.extend({},a),L.set(t,u))}}function mt(e,t){var n=e.getElementsByTagName?e.getElementsByTagName(t||"*"):e.querySelectorAll?e.querySelectorAll(t||"*"):[];return t===undefined||t&&x.nodeName(e,t)?x.merge([e],n):n}function yt(e,t){var n=t.nodeName.toLowerCase();"input"===n&&ot.test(e.type)?t.checked=e.checked:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}x.fn.extend({wrapAll:function(e){var t;return x.isFunction(e)?this.each(function(t){x(this).wrapAll(e.call(this,t))}):(this[0]&&(t=x(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this)},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var vt,xt,bt=/^(none|table(?!-c[ea]).+)/,wt=/^margin/,Tt=RegExp("^("+b+")(.*)$","i"),Ct=RegExp("^("+b+")(?!px)[a-z%]+$","i"),kt=RegExp("^([+-])=("+b+")","i"),Nt={BODY:"block"},Et={position:"absolute",visibility:"hidden",display:"block"},St={letterSpacing:0,fontWeight:400},jt=["Top","Right","Bottom","Left"],Dt=["Webkit","O","Moz","ms"];function At(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Dt.length;while(i--)if(t=Dt[i]+n,t in e)return t;return r}function Lt(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function qt(t){return e.getComputedStyle(t,null)}function Ht(e,t){var n,r,i,o=[],s=0,a=e.length;for(;a>s;s++)r=e[s],r.style&&(o[s]=q.get(r,"olddisplay"),n=r.style.display,t?(o[s]||"none"!==n||(r.style.display=""),""===r.style.display&&Lt(r)&&(o[s]=q.access(r,"olddisplay",Rt(r.nodeName)))):o[s]||(i=Lt(r),(n&&"none"!==n||!i)&&q.set(r,"olddisplay",i?n:x.css(r,"display"))));for(s=0;a>s;s++)r=e[s],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[s]||"":"none"));return e}x.fn.extend({css:function(e,t){return x.access(this,function(e,t,n){var r,i,o={},s=0;if(x.isArray(t)){for(r=qt(e),i=t.length;i>s;s++)o[t[s]]=x.css(e,t[s],!1,r);return o}return n!==undefined?x.style(e,t,n):x.css(e,t)},e,t,arguments.length>1)},show:function(){return Ht(this,!0)},hide:function(){return Ht(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){Lt(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=vt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,s,a=x.camelCase(t),u=e.style;return t=x.cssProps[a]||(x.cssProps[a]=At(u,a)),s=x.cssHooks[t]||x.cssHooks[a],n===undefined?s&&"get"in s&&(i=s.get(e,!1,r))!==undefined?i:u[t]:(o=typeof n,"string"===o&&(i=kt.exec(n))&&(n=(i[1]+1)*i[2]+parseFloat(x.css(e,t)),o="number"),null==n||"number"===o&&isNaN(n)||("number"!==o||x.cssNumber[a]||(n+="px"),x.support.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),s&&"set"in s&&(n=s.set(e,n,r))===undefined||(u[t]=n)),undefined)}},css:function(e,t,n,r){var i,o,s,a=x.camelCase(t);return t=x.cssProps[a]||(x.cssProps[a]=At(e.style,a)),s=x.cssHooks[t]||x.cssHooks[a],s&&"get"in s&&(i=s.get(e,!0,n)),i===undefined&&(i=vt(e,t,r)),"normal"===i&&t in St&&(i=St[t]),""===n||n?(o=parseFloat(i),n===!0||x.isNumeric(o)?o||0:i):i}}),vt=function(e,t,n){var r,i,o,s=n||qt(e),a=s?s.getPropertyValue(t)||s[t]:undefined,u=e.style;return s&&(""!==a||x.contains(e.ownerDocument,e)||(a=x.style(e,t)),Ct.test(a)&&wt.test(t)&&(r=u.width,i=u.minWidth,o=u.maxWidth,u.minWidth=u.maxWidth=u.width=a,a=s.width,u.width=r,u.minWidth=i,u.maxWidth=o)),a};function Ot(e,t,n){var r=Tt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function Ft(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,s=0;for(;4>o;o+=2)"margin"===n&&(s+=x.css(e,n+jt[o],!0,i)),r?("content"===n&&(s-=x.css(e,"padding"+jt[o],!0,i)),"margin"!==n&&(s-=x.css(e,"border"+jt[o]+"Width",!0,i))):(s+=x.css(e,"padding"+jt[o],!0,i),"padding"!==n&&(s+=x.css(e,"border"+jt[o]+"Width",!0,i)));return s}function Pt(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=qt(e),s=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=vt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Ct.test(i))return i;r=s&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+Ft(e,t,n||(s?"border":"content"),r,o)+"px"}function Rt(e){var t=o,n=Nt[e];return n||(n=Mt(e,t),"none"!==n&&n||(xt=(xt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(xt[0].contentWindow||xt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=Mt(e,t),xt.detach()),Nt[e]=n),n}function Mt(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,t){x.cssHooks[t]={get:function(e,n,r){return n?0===e.offsetWidth&&bt.test(x.css(e,"display"))?x.swap(e,Et,function(){return Pt(e,t,r)}):Pt(e,t,r):undefined},set:function(e,n,r){var i=r&&qt(e);return Ot(e,n,r?Ft(e,t,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,t){return t?x.swap(e,{display:"inline-block"},vt,[e,"marginRight"]):undefined}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,t){x.cssHooks[t]={get:function(e,n){return n?(n=vt(e,t),Ct.test(n)?x(e).position()[t]+"px":n):undefined}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+jt[r]+t]=o[r]||o[r-2]||o[0];return i}},wt.test(e)||(x.cssHooks[e+t].set=Ot)});var Wt=/%20/g,$t=/\[\]$/,Bt=/\r?\n/g,It=/^(?:submit|button|image|reset|file)$/i,zt=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&zt.test(this.nodeName)&&!It.test(e)&&(this.checked||!ot.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(Bt,"\r\n")}}):{name:t.name,value:n.replace(Bt,"\r\n")}}).get()}}),x.param=function(e,t){var n,r=[],i=function(e,t){t=x.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(t===undefined&&(t=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){i(this.name,this.value)});else for(n in e)_t(n,e[n],t,i);return r.join("&").replace(Wt,"+")};function _t(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||$t.test(e)?r(e,i):_t(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)_t(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)
},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var Xt,Ut,Yt=x.now(),Vt=/\?/,Gt=/#.*$/,Jt=/([?&])_=[^&]*/,Qt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Kt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Zt=/^(?:GET|HEAD)$/,en=/^\/\//,tn=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,nn=x.fn.load,rn={},on={},sn="*/".concat("*");try{Ut=i.href}catch(an){Ut=o.createElement("a"),Ut.href="",Ut=Ut.href}Xt=tn.exec(Ut.toLowerCase())||[];function un(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(w)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function ln(e,t,n,r){var i={},o=e===on;function s(a){var u;return i[a]=!0,x.each(e[a]||[],function(e,a){var l=a(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):undefined:(t.dataTypes.unshift(l),s(l),!1)}),u}return s(t.dataTypes[0])||!i["*"]&&s("*")}function cn(e,t){var n,r,i=x.ajaxSettings.flatOptions||{};for(n in t)t[n]!==undefined&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,t,n){if("string"!=typeof e&&nn)return nn.apply(this,arguments);var r,i,o,s=this,a=e.indexOf(" ");return a>=0&&(r=e.slice(a),e=e.slice(0,a)),x.isFunction(t)?(n=t,t=undefined):t&&"object"==typeof t&&(i="POST"),s.length>0&&x.ajax({url:e,type:i,dataType:"html",data:t}).done(function(e){o=arguments,s.html(r?x("<div>").append(x.parseHTML(e)).find(r):e)}).complete(n&&function(e,t){s.each(n,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ut,type:"GET",isLocal:Kt.test(Xt[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":sn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?cn(cn(e,x.ajaxSettings),t):cn(x.ajaxSettings,e)},ajaxPrefilter:un(rn),ajaxTransport:un(on),ajax:function(e,t){"object"==typeof e&&(t=e,e=undefined),t=t||{};var n,r,i,o,s,a,u,l,c=x.ajaxSetup({},t),p=c.context||c,f=c.context&&(p.nodeType||p.jquery)?x(p):x.event,h=x.Deferred(),d=x.Callbacks("once memory"),g=c.statusCode||{},m={},y={},v=0,b="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(2===v){if(!o){o={};while(t=Qt.exec(i))o[t[1].toLowerCase()]=t[2]}t=o[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===v?i:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return v||(e=y[n]=y[n]||e,m[e]=t),this},overrideMimeType:function(e){return v||(c.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>v)for(t in e)g[t]=[g[t],e[t]];else T.always(e[T.status]);return this},abort:function(e){var t=e||b;return n&&n.abort(t),k(0,t),this}};if(h.promise(T).complete=d.add,T.success=T.done,T.error=T.fail,c.url=((e||c.url||Ut)+"").replace(Gt,"").replace(en,Xt[1]+"//"),c.type=t.method||t.type||c.method||c.type,c.dataTypes=x.trim(c.dataType||"*").toLowerCase().match(w)||[""],null==c.crossDomain&&(a=tn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===Xt[1]&&a[2]===Xt[2]&&(a[3]||("http:"===a[1]?"80":"443"))===(Xt[3]||("http:"===Xt[1]?"80":"443")))),c.data&&c.processData&&"string"!=typeof c.data&&(c.data=x.param(c.data,c.traditional)),ln(rn,c,t,T),2===v)return T;u=c.global,u&&0===x.active++&&x.event.trigger("ajaxStart"),c.type=c.type.toUpperCase(),c.hasContent=!Zt.test(c.type),r=c.url,c.hasContent||(c.data&&(r=c.url+=(Vt.test(r)?"&":"?")+c.data,delete c.data),c.cache===!1&&(c.url=Jt.test(r)?r.replace(Jt,"$1_="+Yt++):r+(Vt.test(r)?"&":"?")+"_="+Yt++)),c.ifModified&&(x.lastModified[r]&&T.setRequestHeader("If-Modified-Since",x.lastModified[r]),x.etag[r]&&T.setRequestHeader("If-None-Match",x.etag[r])),(c.data&&c.hasContent&&c.contentType!==!1||t.contentType)&&T.setRequestHeader("Content-Type",c.contentType),T.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+("*"!==c.dataTypes[0]?", "+sn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)T.setRequestHeader(l,c.headers[l]);if(c.beforeSend&&(c.beforeSend.call(p,T,c)===!1||2===v))return T.abort();b="abort";for(l in{success:1,error:1,complete:1})T[l](c[l]);if(n=ln(on,c,t,T)){T.readyState=1,u&&f.trigger("ajaxSend",[T,c]),c.async&&c.timeout>0&&(s=setTimeout(function(){T.abort("timeout")},c.timeout));try{v=1,n.send(m,k)}catch(C){if(!(2>v))throw C;k(-1,C)}}else k(-1,"No Transport");function k(e,t,o,a){var l,m,y,b,w,C=t;2!==v&&(v=2,s&&clearTimeout(s),n=undefined,i=a||"",T.readyState=e>0?4:0,l=e>=200&&300>e||304===e,o&&(b=pn(c,T,o)),b=fn(c,b,T,l),l?(c.ifModified&&(w=T.getResponseHeader("Last-Modified"),w&&(x.lastModified[r]=w),w=T.getResponseHeader("etag"),w&&(x.etag[r]=w)),204===e||"HEAD"===c.type?C="nocontent":304===e?C="notmodified":(C=b.state,m=b.data,y=b.error,l=!y)):(y=C,(e||!C)&&(C="error",0>e&&(e=0))),T.status=e,T.statusText=(t||C)+"",l?h.resolveWith(p,[m,C,T]):h.rejectWith(p,[T,C,y]),T.statusCode(g),g=undefined,u&&f.trigger(l?"ajaxSuccess":"ajaxError",[T,c,l?m:y]),d.fireWith(p,[T,C]),u&&(f.trigger("ajaxComplete",[T,c]),--x.active||x.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,t){return x.get(e,undefined,t,"script")}}),x.each(["get","post"],function(e,t){x[t]=function(e,n,r,i){return x.isFunction(n)&&(i=i||r,r=n,n=undefined),x.ajax({url:e,type:t,dataType:i,data:n,success:r})}});function pn(e,t,n){var r,i,o,s,a=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),r===undefined&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in a)if(a[i]&&a[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}s||(s=i)}o=o||s}return o?(o!==u[0]&&u.unshift(o),n[o]):undefined}function fn(e,t,n,r){var i,o,s,a,u,l={},c=e.dataTypes.slice();if(c[1])for(s in e.converters)l[s.toLowerCase()]=e.converters[s];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(s=l[u+" "+o]||l["* "+o],!s)for(i in l)if(a=i.split(" "),a[1]===o&&(s=l[u+" "+a[0]]||l["* "+a[0]])){s===!0?s=l[i]:l[i]!==!0&&(o=a[0],c.unshift(a[1]));break}if(s!==!0)if(s&&e["throws"])t=s(t);else try{t=s(t)}catch(p){return{state:"parsererror",error:s?p:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===undefined&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),x.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(r,i){t=x("<script>").prop({async:!0,charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),o.head.appendChild(t[0])},abort:function(){n&&n()}}}});var hn=[],dn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=hn.pop()||x.expando+"_"+Yt++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,s,a=t.jsonp!==!1&&(dn.test(t.url)?"url":"string"==typeof t.data&&!(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&dn.test(t.data)&&"data");return a||"jsonp"===t.dataTypes[0]?(i=t.jsonpCallback=x.isFunction(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,a?t[a]=t[a].replace(dn,"$1"+i):t.jsonp!==!1&&(t.url+=(Vt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return s||x.error(i+" was not called"),s[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){s=arguments},r.always(function(){e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,hn.push(i)),s&&x.isFunction(o)&&o(s[0]),s=o=undefined}),"script"):undefined}),x.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(e){}};var gn=x.ajaxSettings.xhr(),mn={0:200,1223:204},yn=0,vn={};e.ActiveXObject&&x(e).on("unload",function(){for(var e in vn)vn[e]();vn=undefined}),x.support.cors=!!gn&&"withCredentials"in gn,x.support.ajax=gn=!!gn,x.ajaxTransport(function(e){var t;return x.support.cors||gn&&!e.crossDomain?{send:function(n,r){var i,o,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(i in e.xhrFields)s[i]=e.xhrFields[i];e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||n["X-Requested-With"]||(n["X-Requested-With"]="XMLHttpRequest");for(i in n)s.setRequestHeader(i,n[i]);t=function(e){return function(){t&&(delete vn[o],t=s.onload=s.onerror=null,"abort"===e?s.abort():"error"===e?r(s.status||404,s.statusText):r(mn[s.status]||s.status,s.statusText,"string"==typeof s.responseText?{text:s.responseText}:undefined,s.getAllResponseHeaders()))}},s.onload=t(),s.onerror=t("error"),t=vn[o=yn++]=t("abort"),s.send(e.hasContent&&e.data||null)},abort:function(){t&&t()}}:undefined});var xn,bn,wn=/^(?:toggle|show|hide)$/,Tn=RegExp("^(?:([+-])=|)("+b+")([a-z%]*)$","i"),Cn=/queueHooks$/,kn=[An],Nn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Tn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),s=(x.cssNumber[e]||"px"!==o&&+r)&&Tn.exec(x.css(n.elem,e)),a=1,u=20;if(s&&s[3]!==o){o=o||s[3],i=i||[],s=+r||1;do a=a||".5",s/=a,x.style(n.elem,e,s+o);while(a!==(a=n.cur()/r)&&1!==a&&--u)}return i&&(s=n.start=+s||+r||0,n.unit=o,n.end=i[1]?s+(i[1]+1)*i[2]:+i[2]),n}]};function En(){return setTimeout(function(){xn=undefined}),xn=x.now()}function Sn(e,t,n){var r,i=(Nn[t]||[]).concat(Nn["*"]),o=0,s=i.length;for(;s>o;o++)if(r=i[o].call(n,t,e))return r}function jn(e,t,n){var r,i,o=0,s=kn.length,a=x.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;var t=xn||En(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,s=0,u=l.tweens.length;for(;u>s;s++)l.tweens[s].run(o);return a.notifyWith(e,[l,o,n]),1>o&&u?n:(a.resolveWith(e,[l]),!1)},l=a.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:xn||En(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?a.resolveWith(e,[l,t]):a.rejectWith(e,[l,t]),this}}),c=l.props;for(Dn(c,l.opts.specialEasing);s>o;o++)if(r=kn[o].call(l,e,c,l.opts))return r;return x.map(c,Sn,l),x.isFunction(l.opts.start)&&l.opts.start.call(e,l),x.fx.timer(x.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function Dn(e,t){var n,r,i,o,s;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),s=x.cssHooks[r],s&&"expand"in s){o=s.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(jn,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Nn[n]=Nn[n]||[],Nn[n].unshift(t)},prefilter:function(e,t){t?kn.unshift(e):kn.push(e)}});function An(e,t,n){var r,i,o,s,a,u,l=this,c={},p=e.style,f=e.nodeType&&Lt(e),h=q.get(e,"fxshow");n.queue||(a=x._queueHooks(e,"fx"),null==a.unqueued&&(a.unqueued=0,u=a.empty.fire,a.empty.fire=function(){a.unqueued||u()}),a.unqueued++,l.always(function(){l.always(function(){a.unqueued--,x.queue(e,"fx").length||a.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(p.display="inline-block")),n.overflow&&(p.overflow="hidden",l.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],wn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show")){if("show"!==i||!h||h[r]===undefined)continue;f=!0}c[r]=h&&h[r]||x.style(e,r)}if(!x.isEmptyObject(c)){h?"hidden"in h&&(f=h.hidden):h=q.access(e,"fxshow",{}),o&&(h.hidden=!f),f?x(e).show():l.done(function(){x(e).hide()}),l.done(function(){var t;q.remove(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)s=Sn(f?h[r]:0,r,l),r in h||(h[r]=s.start,f&&(s.end=s.start,s.start="width"===r||"height"===r?1:0))}}function Ln(e,t,n,r,i){return new Ln.prototype.init(e,t,n,r,i)}x.Tween=Ln,Ln.prototype={constructor:Ln,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=Ln.propHooks[this.prop];return e&&e.get?e.get(this):Ln.propHooks._default.get(this)},run:function(e){var t,n=Ln.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Ln.propHooks._default.set(this),this}},Ln.prototype.init.prototype=Ln.prototype,Ln.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Ln.propHooks.scrollTop=Ln.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(qn(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Lt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),s=function(){var t=jn(this,x.extend({},e),o);(i||q.get(this,"finish"))&&t.stop(!0)};return s.finish=s,i||o.queue===!1?this.each(s):this.queue(o.queue,s)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=undefined),t&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=x.timers,s=q.get(this);if(i)s[i]&&s[i].stop&&r(s[i]);else for(i in s)s[i]&&s[i].stop&&Cn.test(i)&&r(s[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));(t||!n)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=q.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,s=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;s>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function qn(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=jt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:qn("show"),slideUp:qn("hide"),slideToggle:qn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=Ln.prototype.init,x.fx.tick=function(){var e,t=x.timers,n=0;for(xn=x.now();t.length>n;n++)e=t[n],e()||t[n]!==e||t.splice(n--,1);t.length||x.fx.stop(),xn=undefined},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){bn||(bn=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(bn),bn=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===undefined?this:this.each(function(t){x.offset.setOffset(this,e,t)});var t,n,i=this[0],o={top:0,left:0},s=i&&i.ownerDocument;if(s)return t=s.documentElement,x.contains(t,i)?(typeof i.getBoundingClientRect!==r&&(o=i.getBoundingClientRect()),n=Hn(s),{top:o.top+n.pageYOffset-t.clientTop,left:o.left+n.pageXOffset-t.clientLeft}):o},x.offset={setOffset:function(e,t,n){var r,i,o,s,a,u,l,c=x.css(e,"position"),p=x(e),f={};"static"===c&&(e.style.position="relative"),a=p.offset(),o=x.css(e,"top"),u=x.css(e,"left"),l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1,l?(r=p.position(),s=r.top,i=r.left):(s=parseFloat(o)||0,i=parseFloat(u)||0),x.isFunction(t)&&(t=t.call(e,n,a)),null!=t.top&&(f.top=t.top-a.top+s),null!=t.left&&(f.left=t.left-a.left+i),"using"in t?t.using.call(e,f):p.css(f)}},x.fn.extend({position:function(){if(this[0]){var e,t,n=this[0],r={top:0,left:0};return"fixed"===x.css(n,"position")?t=n.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(r=e.offset()),r.top+=x.css(e[0],"borderTopWidth",!0),r.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-r.top-x.css(n,"marginTop",!0),left:t.left-r.left-x.css(n,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,n){var r="pageYOffset"===n;x.fn[t]=function(i){return x.access(this,function(t,i,o){var s=Hn(t);return o===undefined?s?s[n]:t[i]:(s?s.scrollTo(r?e.pageXOffset:o,r?o:e.pageYOffset):t[i]=o,undefined)},t,i,arguments.length,null)}});function Hn(e){return x.isWindow(e)?e:9===e.nodeType&&e.defaultView}x.each({Height:"height",Width:"width"},function(e,t){x.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){x.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),s=n||(r===!0||i===!0?"margin":"border");return x.access(this,function(t,n,r){var i;return x.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):r===undefined?x.css(t,n,s):x.style(t,n,r,s)},t,o?r:undefined,o,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}),"object"==typeof e&&"object"==typeof e.document&&(e.jQuery=e.$=x)})(window);
/*
"Skeuocard" -- A Skeuomorphic Credit-Card Input Enhancement
@description Skeuocard is a skeuomorphic credit card input plugin, supporting 
             progressive enhancement. It renders a credit-card input which 
             behaves similarly to a physical credit card.
@author Ken Keiter <ken@kenkeiter.com>
@updated 2013-07-25
@website http://kenkeiter.com/
@exports [window.Skeuocard]
*/


(function() {
  var $, Skeuocard, visaProduct,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  Skeuocard = (function() {
    Skeuocard.currentDate = new Date();

    function Skeuocard(el, opts) {
      var optDefaults;
      if (opts == null) {
        opts = {};
      }
      this.el = {
        container: $(el),
        underlyingFields: {}
      };
      this._inputViews = {};
      this._inputViewsByFace = {
        front: [],
        back: []
      };
      this._tabViews = {};
      this._state = {};
      this.product = null;
      this.visibleFace = 'front';
      optDefaults = {
        debug: false,
        dontFocus: false,
        acceptedCardProducts: null,
        cardNumberPlaceholderChar: 'X',
        genericPlaceholder: "XXXX XXXX XXXX XXXX",
        typeInputSelector: '[name="cc_type"]',
        numberInputSelector: '[name="cc_number"]',
        expMonthInputSelector: '[name="cc_exp_month"]',
        expYearInputSelector: '[name="cc_exp_year"]',
        nameInputSelector: '[name="cc_name"]',
        cvcInputSelector: '[name="cc_cvc"]',
        initialValues: {},
        validationState: {},
        strings: {
          hiddenFaceFillPrompt: "<strong>Click here</strong> to <br>fill in the other side.",
          hiddenFaceErrorWarning: "There's a problem on the other side.",
          hiddenFaceSwitchPrompt: "Forget something?<br> Flip the card over."
        }
      };
      this.options = $.extend(optDefaults, opts);
      this._conformDOM();
      this._bindInputEvents();
      this._importImplicitOptions();
      this.render();
    }

    Skeuocard.prototype._log = function() {
      var msg;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if ((typeof console !== "undefined" && console !== null ? console.log : void 0) && !!this.options.debug) {
        if (this.options.debug != null) {
          return console.log.apply(console, ["[skeuocard]"].concat(__slice.call(msg)));
        }
      }
    };

    Skeuocard.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el.container).trigger.apply(_ref, args);
    };

    Skeuocard.prototype.bind = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el.container).bind.apply(_ref, args);
    };

    /*
    Transform the elements within the container, conforming the DOM so that it 
    becomes styleable, and that the underlying inputs are hidden.
    */


    Skeuocard.prototype._conformDOM = function() {
      this.el.container.removeClass('no-js');
      this.el.container.addClass("skeuocard js");
      this.el.container.find("> :not(input,select,textarea)").remove();
      this.el.container.find("> input,select,textarea").hide();
      this.el.underlyingFields = {
        type: this.el.container.find(this.options.typeInputSelector),
        number: this.el.container.find(this.options.numberInputSelector),
        expMonth: this.el.container.find(this.options.expMonthInputSelector),
        expYear: this.el.container.find(this.options.expYearInputSelector),
        name: this.el.container.find(this.options.nameInputSelector),
        cvc: this.el.container.find(this.options.cvcInputSelector)
      };
      this.el.front = $("<div>").attr({
        "class": "face front"
      });
      this.el.back = $("<div>").attr({
        "class": "face back"
      });
      this.el.cardBody = $("<div>").attr({
        "class": "card-body"
      });
      this.el.front.appendTo(this.el.cardBody);
      this.el.back.appendTo(this.el.cardBody);
      this.el.cardBody.appendTo(this.el.container);
      this._tabViews.front = new Skeuocard.prototype.FlipTabView(this, 'front', {
        strings: this.options.strings
      });
      this._tabViews.back = new Skeuocard.prototype.FlipTabView(this, 'back', {
        strings: this.options.strings
      });
      this.el.front.prepend(this._tabViews.front.el);
      this.el.back.prepend(this._tabViews.back.el);
      this._tabViews.front.hide();
      this._tabViews.back.hide();
      this._inputViews = {
        number: new this.SegmentedCardNumberInputView(),
        exp: new this.ExpirationInputView({
          currentDate: this.options.currentDate
        }),
        name: new this.TextInputView({
          "class": "cc-name",
          placeholder: "YOUR NAME"
        }),
        cvc: new this.TextInputView({
          "class": "cc-cvc",
          placeholder: "XXX",
          requireMaxLength: true
        })
      };
      this._inputViews.number.el.addClass('cc-number');
      this._inputViews.number.el.appendTo(this.el.front);
      this._inputViews.name.el.appendTo(this.el.front);
      this._inputViews.exp.el.addClass('cc-exp');
      this._inputViews.exp.el.appendTo(this.el.front);
      this._inputViews.cvc.el.appendTo(this.el.back);
      return this.el.container;
    };

    /*
    Import implicit initialization options from the DOM. Brings in things like 
    the accepted card type, initial validation state, existing values, etc.
    */


    Skeuocard.prototype._importImplicitOptions = function() {
      var fieldEl, fieldName, _initialExp, _ref,
        _this = this;
      _ref = this.el.underlyingFields;
      for (fieldName in _ref) {
        fieldEl = _ref[fieldName];
        if (this.options.initialValues[fieldName] == null) {
          this.options.initialValues[fieldName] = fieldEl.val();
        } else {
          this.options.initialValues[fieldName] = this.options.initialValues[fieldName].toString();
          this._setUnderlyingValue(fieldName, this.options.initialValues[fieldName]);
        }
        if (this.options.initialValues[fieldName].length > 0) {
          this._state['initiallyFilled'] = true;
        }
        if (this.options.validationState[fieldName] == null) {
          this.options.validationState[fieldName] = !fieldEl.hasClass('invalid');
        }
      }
      if (this.options.acceptedCardProducts == null) {
        this.options.acceptedCardProducts = [];
        this.el.underlyingFields.type.find('option').each(function(i, _el) {
          var el, shortname;
          el = $(_el);
          shortname = el.attr('data-sc-type') || el.attr('value');
          return _this.options.acceptedCardProducts.push(shortname);
        });
      }
      if (this.options.initialValues.number.length > 0) {
        this.set('number', this.options.initialValues.number);
      }
      if (this.options.initialValues.name.length > 0) {
        this.set('name', this.options.initialValues.name);
      }
      if (this.options.initialValues.cvc.length > 0) {
        this.set('cvc', this.options.initialValues.cvc);
      }
      if (this.options.initialValues.expYear.length > 0 && this.options.initialValues.expMonth.length > 0) {
        _initialExp = new Date(parseInt(this.options.initialValues.expYear), parseInt(this.options.initialValues.expMonth) - 1, 1);
        this.set('exp', _initialExp);
      }
      this._updateValidationForFace('front');
      return this._updateValidationForFace('back');
    };

    Skeuocard.prototype.set = function(field, newValue) {
      this._inputViews[field].setValue(newValue);
      return this._inputViews[field].trigger('valueChanged', this._inputViews[field]);
    };

    /*
    Bind interaction events to their appropriate handlers.
    */


    Skeuocard.prototype._bindInputEvents = function() {
      var _expirationChange,
        _this = this;
      this.el.underlyingFields.number.bind("change", function(e) {
        _this._inputViews.number.setValue(_this._getUnderlyingValue('number'));
        return _this.render();
      });
      _expirationChange = function(e) {
        var month, year;
        month = parseInt(_this._getUnderlyingValue('expMonth'));
        year = parseInt(_this._getUnderlyingValue('expYear'));
        _this._inputViews.exp.setValue(new Date(year, month - 1));
        return _this.render();
      };
      this.el.underlyingFields.expMonth.bind("change", _expirationChange);
      this.el.underlyingFields.expYear.bind("change", _expirationChange);
      this.el.underlyingFields.name.bind("change", function(e) {
        _this._inputViews.exp.setValue(_this._getUnderlyingValue('name'));
        return _this.render();
      });
      this.el.underlyingFields.cvc.bind("change", function(e) {
        _this._inputViews.exp.setValue(_this._getUnderlyingValue('cvc'));
        return _this.render();
      });
      this._inputViews.number.bind("change valueChanged", function(e, input) {
        var cardNumber, matchedProduct, number, previousProduct, _ref, _ref1;
        cardNumber = input.getValue();
        _this._setUnderlyingValue('number', cardNumber);
        _this._updateValidation('number', cardNumber);
        number = _this._getUnderlyingValue('number');
        matchedProduct = Skeuocard.prototype.CardProduct.firstMatchingNumber(number);
        if (!((_ref = _this.product) != null ? _ref.eql(matchedProduct) : void 0)) {
          _this._log("Product will change:", _this.product, "=>", matchedProduct);
          if (_ref1 = matchedProduct != null ? matchedProduct.attrs.companyShortname : void 0, __indexOf.call(_this.options.acceptedCardProducts, _ref1) >= 0) {
            _this.trigger('productWillChange.skeuocard', [_this, _this.product, matchedProduct]);
            previousProduct = _this.product;
            _this.el.container.removeClass('unaccepted');
            _this._renderProduct(matchedProduct);
            _this.product = matchedProduct;
          } else if (matchedProduct != null) {
            _this.trigger('productWillChange.skeuocard', [_this, _this.product, null]);
            _this.el.container.addClass('unaccepted');
            _this._renderProduct(null);
            _this.product = null;
          } else {
            _this.trigger('productWillChange.skeuocard', [_this, _this.product, null]);
            _this.el.container.removeClass('unaccepted');
            _this._renderProduct(null);
            _this.product = null;
          }
          return _this.trigger('productDidChange.skeuocard', [_this, previousProduct, _this.product]);
        }
      });
      this._inputViews.exp.bind("keyup valueChanged", function(e, input) {
        var newDate;
        newDate = input.getValue();
        _this._updateValidation('exp', newDate);
        if (newDate != null) {
          _this._setUnderlyingValue('expMonth', newDate.getMonth() + 1);
          return _this._setUnderlyingValue('expYear', newDate.getFullYear());
        }
      });
      this._inputViews.name.bind("keyup valueChanged", function(e, input) {
        var value;
        value = input.getValue();
        _this._setUnderlyingValue('name', value);
        return _this._updateValidation('name', value);
      });
      this._inputViews.cvc.bind("keyup valueChanged", function(e, input) {
        var value;
        value = input.getValue();
        _this._setUnderlyingValue('cvc', value);
        return _this._updateValidation('cvc', value);
      });
      this.el.container.delegate("input", "keyup keydown", this._handleFieldTab.bind(this));
      this._tabViews.front.el.click(function() {
        return _this.flip();
      });
      return this._tabViews.back.el.click(function() {
        return _this.flip();
      });
    };

    Skeuocard.prototype._handleFieldTab = function(e) {
      var backFieldEls, currentFieldEl, frontFieldEls, _currentFace, _oppositeFace;
      if (e.which === 9) {
        currentFieldEl = $(e.currentTarget);
        _oppositeFace = this.visibleFace === 'front' ? 'back' : 'front';
        _currentFace = this.visibleFace === 'front' ? 'front' : 'back';
        backFieldEls = this.el[_oppositeFace].find('input');
        frontFieldEls = this.el[_currentFace].find('input');
        if (this.visibleFace === 'front' && this.el.front.hasClass('filled') && backFieldEls.length > 0 && frontFieldEls.index(currentFieldEl) === frontFieldEls.length - 1 && !e.shiftKey) {
          this.flip();
          backFieldEls.first().focus();
          e.preventDefault();
        }
        if (this.visibleFace === 'back' && e.shiftKey) {
          this.flip();
          backFieldEls.last().focus();
          e.preventDefault();
        }
      }
      return true;
    };

    Skeuocard.prototype._updateValidation = function(fieldName, newValue) {
      var fillStateChanged, isFilled, isFixed, isValid, needsFix, validationStateChanged;
      if (this.product == null) {
        return false;
      }
      isFilled = this.product[fieldName].isFilled(newValue);
      needsFix = (this.options.validationState[fieldName] != null) === false;
      isFixed = (this.options.initialValues[fieldName] != null) && newValue !== this.options.initialValues[fieldName];
      isValid = this.product[fieldName].isValid(newValue) && ((needsFix && isFixed) || true);
      fillStateChanged = this._state["" + fieldName + "Filled"] !== isFilled;
      validationStateChanged = this._state["" + fieldName + "Valid"] !== isValid;
      if (fillStateChanged) {
        this.trigger("fieldFillStateWillChange.skeuocard", [this, fieldName, isFilled]);
        this._inputViews[fieldName].el.toggleClass('filled', isFilled);
        this._state["" + fieldName + "Filled"] = isFilled;
        this.trigger("fieldFillStateDidChange.skeuocard", [this, fieldName, isFilled]);
      }
      if (validationStateChanged) {
        this.trigger("fieldValidationStateWillChange.skeuocard", [this, fieldName, isValid]);
        this._inputViews[fieldName].el.toggleClass('valid', isValid);
        this._inputViews[fieldName].el.toggleClass('invalid', !isValid);
        this._state["" + fieldName + "Valid"] = isValid;
        this.trigger("fieldValidationStateDidChange.skeuocard", [this, fieldName, isValid]);
      }
      return this._updateValidationForFace(this.visibleFace);
    };

    Skeuocard.prototype._updateValidationForFace = function(face) {
      var fieldsFilled, fieldsValid, fillStateChanged, isFilled, isValid, iv, validationStateChanged;
      fieldsFilled = ((function() {
        var _i, _len, _ref, _results;
        _ref = this._inputViewsByFace[face];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          iv = _ref[_i];
          _results.push(iv.el.hasClass('filled'));
        }
        return _results;
      }).call(this)).every(Boolean);
      fieldsValid = ((function() {
        var _i, _len, _ref, _results;
        _ref = this._inputViewsByFace[face];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          iv = _ref[_i];
          _results.push(iv.el.hasClass('valid'));
        }
        return _results;
      }).call(this)).every(Boolean);
      isFilled = (fieldsFilled && (this.product != null)) || (this._state['initiallyFilled'] || false);
      isValid = fieldsValid && (this.product != null);
      fillStateChanged = this._state["" + face + "Filled"] !== isFilled;
      validationStateChanged = this._state["" + face + "Valid"] !== isValid;
      if (fillStateChanged) {
        this.trigger("faceFillStateWillChange.skeuocard", [this, face, isFilled]);
        this.el[face].toggleClass('filled', isFilled);
        this._state["" + face + "Filled"] = isFilled;
        this.trigger("faceFillStateDidChange.skeuocard", [this, face, isFilled]);
      }
      if (validationStateChanged) {
        this.trigger("faceValidationStateWillChange.skeuocard", [this, face, isValid]);
        this.el[face].toggleClass('valid', isValid);
        this.el[face].toggleClass('invalid', !isValid);
        this._state["" + face + "Valid"] = isValid;
        return this.trigger("faceValidationStateDidChange.skeuocard", [this, face, isValid]);
      }
    };

    /*
    Assert rendering changes necessary for the current product. Passing a null 
    value instead of a product will revert the card to a generic state.
    */


    Skeuocard.prototype._renderProduct = function(product) {
      var destFace, fieldName, focused, view, viewEl, _ref, _ref1,
        _this = this;
      this._log("[_renderProduct]", "Rendering product:", product);
      this.el.container.removeClass(function(index, css) {
        return (css.match(/\b(product|issuer)-\S+/g) || []).join(' ');
      });
      if ((product != null ? product.attrs.companyShortname : void 0) != null) {
        this.el.container.addClass("product-" + product.attrs.companyShortname);
      }
      if ((product != null ? product.attrs.issuerShortname : void 0) != null) {
        this.el.container.addClass("issuer-" + product.attrs.issuerShortname);
      }
      this._setUnderlyingValue('type', (product != null ? product.attrs.companyShortname : void 0) || null);
      this._inputViews.number.setGroupings((product != null ? product.attrs.cardNumberGrouping : void 0) || [this.options.genericPlaceholder.length], this.options.dontFocus);
      delete this.options.dontFocus;
      if (product != null) {
        this._inputViews.exp.reconfigure({
          pattern: (product != null ? product.attrs.expirationFormat : void 0) || "MM/YY"
        });
        this._inputViews.cvc.attr({
          maxlength: product.attrs.cvcLength,
          placeholder: new Array(product.attrs.cvcLength + 1).join(this.options.cardNumberPlaceholderChar)
        });
        this._inputViewsByFace = {
          front: [],
          back: []
        };
        focused = $('input:focus');
        _ref = product.attrs.layout;
        for (fieldName in _ref) {
          destFace = _ref[fieldName];
          this._log("Moving", fieldName, "to", destFace);
          viewEl = this._inputViews[fieldName].el.detach();
          viewEl.appendTo(this.el[destFace]);
          this._inputViewsByFace[destFace].push(this._inputViews[fieldName]);
          this._inputViews[fieldName].show();
        }
        setTimeout(function() {
          var fieldEl, fieldLength;
          if ((fieldEl = focused.first()) != null) {
            fieldLength = fieldEl[0].maxLength;
            fieldEl.focus();
            return fieldEl[0].setSelectionRange(fieldLength, fieldLength);
          }
        }, 10);
      } else {
        _ref1 = this._inputViews;
        for (fieldName in _ref1) {
          view = _ref1[fieldName];
          if (fieldName !== 'number') {
            view.hide();
          }
        }
      }
      return product;
    };

    Skeuocard.prototype._renderValidation = function() {
      var fieldName, fieldView, _ref, _results;
      _ref = this._inputViews;
      _results = [];
      for (fieldName in _ref) {
        fieldView = _ref[fieldName];
        _results.push(this._updateValidation(fieldName, fieldView.getValue()));
      }
      return _results;
    };

    Skeuocard.prototype.render = function() {
      this._renderProduct(this.product);
      return this._renderValidation();
    };

    Skeuocard.prototype.flip = function() {
      var surfaceName, targetFace;
      targetFace = this.visibleFace === 'front' ? 'back' : 'front';
      this.trigger('faceWillBecomeVisible.skeuocard', [this, targetFace]);
      this.visibleFace = targetFace;
      this.el.cardBody.toggleClass('flip');
      surfaceName = this.visibleFace === 'front' ? 'front' : 'back';
      this.el[surfaceName].find('.cc-field').not('.filled').find('input').first().focus();
      return this.trigger('faceDidBecomeVisible.skeuocard', [this, targetFace]);
    };

    Skeuocard.prototype._setUnderlyingValue = function(field, newValue) {
      var fieldEl, remapAttrKey, _newValue,
        _this = this;
      fieldEl = this.el.underlyingFields[field];
      _newValue = (newValue || "").toString();
      if (fieldEl == null) {
        throw "Set underlying value of unknown field: " + field + ".";
      }
      this.trigger('change.skeuocard', [this]);
      if (!fieldEl.is('select')) {
        return this.el.underlyingFields[field].val(_newValue);
      } else {
        remapAttrKey = "data-sc-" + field.toLowerCase();
        return fieldEl.find('option').each(function(i, _el) {
          var optionEl;
          optionEl = $(_el);
          if (_newValue === (optionEl.attr(remapAttrKey) || optionEl.attr('value'))) {
            return _this.el.underlyingFields[field].val(optionEl.attr('value'));
          }
        });
      }
    };

    Skeuocard.prototype._getUnderlyingValue = function(field) {
      var _ref;
      return (_ref = this.el.underlyingFields[field]) != null ? _ref.val() : void 0;
    };

    Skeuocard.prototype.isValid = function() {
      return !this.el.front.hasClass('invalid') && !this.el.back.hasClass('invalid');
    };

    return Skeuocard;

  })();

  window.Skeuocard = Skeuocard;

  /*
  Skeuocard::FlipTabView
  Handles rendering of the "flip button" control and its various warning and 
  prompt states.
  */


  Skeuocard.prototype.FlipTabView = (function() {
    function FlipTabView(sc, face, opts) {
      var _this = this;
      if (opts == null) {
        opts = {};
      }
      this.card = sc;
      this.face = face;
      this.el = $("<div class=\"flip-tab " + face + "\"><p></p></div>");
      this.options = opts;
      this._state = {};
      this.card.bind('faceFillStateWillChange.skeuocard', this._faceStateChanged.bind(this));
      this.card.bind('faceValidationStateWillChange.skeuocard', this._faceValidationChanged.bind(this));
      this.card.bind('productWillChange.skeuocard', function(e, card, prevProduct, newProduct) {
        if (newProduct == null) {
          return _this.hide();
        }
      });
    }

    FlipTabView.prototype._faceStateChanged = function(e, card, face, isFilled) {
      var oppositeFace;
      oppositeFace = face === 'front' ? 'back' : 'front';
      if (isFilled === true && this.card._inputViewsByFace[oppositeFace].length > 0) {
        this.show();
      }
      if (face !== this.face) {
        this._state.opposingFaceFilled = isFilled;
      }
      if (this._state.opposingFaceFilled !== true) {
        return this.warn(this.options.strings.hiddenFaceFillPrompt, true);
      }
    };

    FlipTabView.prototype._faceValidationChanged = function(e, card, face, isValid) {
      if (face !== this.face) {
        this._state.opposingFaceValid = isValid;
      }
      if (this._state.opposingFaceValid) {
        return this.prompt(this.options.strings.hiddenFaceSwitchPrompt);
      } else {
        if (this._state.opposingFaceFilled) {
          return this.warn(this.options.strings.hiddenFaceErrorWarning);
        } else {
          return this.warn(this.options.strings.hiddenFaceFillPrompt);
        }
      }
    };

    FlipTabView.prototype._setText = function(text) {
      return this.el.find('p').first().html(text);
    };

    FlipTabView.prototype.warn = function(message) {
      this._resetClasses();
      this._setText(message);
      return this.el.addClass('warn');
    };

    FlipTabView.prototype.prompt = function(message) {
      this._resetClasses();
      this._setText(message);
      return this.el.addClass('prompt');
    };

    FlipTabView.prototype._resetClasses = function() {
      this.el.removeClass('warn');
      return this.el.removeClass('prompt');
    };

    FlipTabView.prototype.show = function() {
      return this.el.show();
    };

    FlipTabView.prototype.hide = function() {
      return this.el.hide();
    };

    return FlipTabView;

  })();

  /*
  # Skeuocard::SegmentedCardNumberInputView
  # Provides a reconfigurable segmented input view for credit card numbers.
  */


  Skeuocard.prototype.SegmentedCardNumberInputView = (function() {
    SegmentedCardNumberInputView.prototype._digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    SegmentedCardNumberInputView.prototype._keys = {
      backspace: 8,
      tab: 9,
      enter: 13,
      del: 46,
      arrowLeft: 37,
      arrowUp: 38,
      arrowRight: 39,
      arrowDown: 40,
      arrows: [37, 38, 39, 40],
      command: 16,
      alt: 17
    };

    SegmentedCardNumberInputView.prototype._specialKeys = [8, 9, 13, 46, 37, 38, 39, 40, 16, 17];

    function SegmentedCardNumberInputView(opts) {
      if (opts == null) {
        opts = {};
      }
      this.optDefaults = {
        value: "",
        groupings: [19],
        placeholderChar: "X"
      };
      this.options = $.extend({}, this.optDefaults, opts);
      this._state = {
        selectingAll: false
      };
      this._buildDOM();
      this.setGroupings(this.options.groupings);
    }

    SegmentedCardNumberInputView.prototype._buildDOM = function() {
      var _this = this;
      this.el = $('<fieldset>');
      this.el.addClass('cc-field');
      this.el.delegate("input", "keypress", this._handleGroupKeyPress.bind(this));
      this.el.delegate("input", "keydown", this._handleGroupKeyDown.bind(this));
      this.el.delegate("input", "keyup", this._handleGroupKeyUp.bind(this));
      this.el.delegate("input", "paste", this._handleGroupPaste.bind(this));
      this.el.delegate("input", "change", this._handleGroupChange.bind(this));
      this.el.delegate("input", "focus", function(e) {
        return _this.el.addClass('focus');
      });
      return this.el.delegate("input", "blur", function(e) {
        return _this.el.removeClass('focus');
      });
    };

    SegmentedCardNumberInputView.prototype._handleGroupKeyDown = function(e) {
      var currentTarget, cursorEnd, cursorStart, inputGroupEl, inputMaxLength, nextInputEl, prevInputEl, _ref;
      if (e.ctrlKey || e.metaKey) {
        return this._handleModifiedKeyDown(e);
      }
      inputGroupEl = $(e.currentTarget);
      currentTarget = e.currentTarget;
      cursorStart = currentTarget.selectionStart;
      cursorEnd = currentTarget.selectionEnd;
      inputMaxLength = currentTarget.maxLength;
      prevInputEl = inputGroupEl.prevAll('input');
      nextInputEl = inputGroupEl.nextAll('input');
      switch (e.which) {
        case this._keys.backspace:
          if (prevInputEl.length > 0 && cursorEnd === 0) {
            this._focusField(prevInputEl.first(), 'end');
          }
          break;
        case this._keys.arrowUp:
          if (cursorEnd === inputMaxLength) {
            this._focusField(inputGroupEl, 'start');
          } else {
            this._focusField(inputGroupEl.prev(), 'end');
          }
          e.preventDefault();
          break;
        case this._keys.arrowDown:
          if (cursorEnd === inputMaxLength) {
            this._focusField(inputGroupEl.next(), 'start');
          } else {
            this._focusField(inputGroupEl, 'end');
          }
          e.preventDefault();
          break;
        case this._keys.arrowLeft:
          if (cursorEnd === 0) {
            this._focusField(inputGroupEl.prev(), 'end');
            e.preventDefault();
          }
          break;
        case this._keys.arrowRight:
          if (cursorEnd === inputMaxLength) {
            this._focusField(inputGroupEl.next(), 'start');
            e.preventDefault();
          }
          break;
        default:
          if (!(_ref = e.which, __indexOf.call(this._specialKeys, _ref) >= 0) && (cursorStart === inputMaxLength && cursorEnd === inputMaxLength) && nextInputEl.length !== 0) {
            this._focusField(nextInputEl.first(), 'start');
          }
      }
      return true;
    };

    SegmentedCardNumberInputView.prototype._handleGroupKeyPress = function(e) {
      var inputGroupEl, isDigit, _ref, _ref1;
      inputGroupEl = $(e.currentTarget);
      isDigit = (_ref = String.fromCharCode(e.which), __indexOf.call(this._digits, _ref) >= 0);
      if (e.ctrlKey || e.metaKey) {
        return true;
      }
      if (e.which === 0) {
        return true;
      }
      if ((!e.shiftKey && (_ref1 = e.which, __indexOf.call(this._specialKeys, _ref1) >= 0)) || isDigit) {
        return true;
      }
      e.preventDefault();
      return false;
    };

    SegmentedCardNumberInputView.prototype._handleGroupKeyUp = function(e) {
      var currentTarget, cursorEnd, cursorStart, inputGroupEl, inputMaxLength, nextInputEl, _ref, _ref1, _ref2;
      inputGroupEl = $(e.currentTarget);
      currentTarget = e.currentTarget;
      inputMaxLength = currentTarget.maxLength;
      cursorStart = currentTarget.selectionStart;
      cursorEnd = currentTarget.selectionEnd;
      nextInputEl = inputGroupEl.nextAll('input');
      if (e.ctrlKey || e.metaKey) {
        return true;
      }
      if (this._state.selectingAll && (_ref = e.which, __indexOf.call(this._specialKeys, _ref) >= 0) && e.which !== this._keys.command && e.which !== this._keys.alt) {
        this._endSelectAll();
      }
      if (!(_ref1 = e.which, __indexOf.call(this._specialKeys, _ref1) >= 0) && !(e.shiftKey && e.which === this._keys.tab) && (cursorStart === inputMaxLength && cursorEnd === inputMaxLength) && nextInputEl.length !== 0) {
        this._focusField(nextInputEl.first(), 'start');
      }
      if (!(e.shiftKey && (_ref2 = e.which, __indexOf.call(this._specialKeys, _ref2) >= 0))) {
        this.trigger('change', [this]);
      }
      return true;
    };

    SegmentedCardNumberInputView.prototype._handleModifiedKeyDown = function(e) {
      var char;
      char = String.fromCharCode(e.which);
      switch (char) {
        case 'a':
        case 'A':
          this._beginSelectAll();
          return e.preventDefault();
      }
    };

    SegmentedCardNumberInputView.prototype._handleGroupPaste = function(e) {
      var _this = this;
      return setTimeout(function() {
        var newValue;
        newValue = _this.getValue().replace(/[^0-9]+/g, '');
        if (_this._state.selectingAll) {
          _this._endSelectAll();
        }
        _this.setValue(newValue);
        return _this.trigger('change', [_this]);
      }, 50);
    };

    SegmentedCardNumberInputView.prototype._handleGroupChange = function(e) {
      return e.stopPropagation();
    };

    SegmentedCardNumberInputView.prototype._getFocusedField = function() {
      return this.el.find("input:focus");
    };

    SegmentedCardNumberInputView.prototype._beginSelectAll = function() {
      var fieldEl;
      if (!this.el.hasClass('selecting-all')) {
        this._state.lastGrouping = this.options.groupings;
        this._state.lastLength = this.getValue().length;
        this.setGroupings(this.optDefaults.groupings);
        this.el.addClass('selecting-all');
        fieldEl = this.el.find("input");
        fieldEl[0].setSelectionRange(0, fieldEl.val().length);
        return this._state.selectingAll = true;
      } else {
        fieldEl = this.el.find("input");
        return fieldEl[0].setSelectionRange(0, fieldEl.val().length);
      }
    };

    SegmentedCardNumberInputView.prototype._endSelectAll = function() {
      if (this.el.hasClass('selecting-all')) {
        this._state.selectingAll = false;
        if (this._state.lastLength === this.getValue().length) {
          this.setGroupings(this._state.lastGrouping);
        }
        return this.el.removeClass('selecting-all');
      }
    };

    SegmentedCardNumberInputView.prototype._indexInValueAtFieldSelection = function(field) {
      var groupingIndex, i, len, offset, _i, _len, _ref;
      groupingIndex = this.el.find('input').index(field);
      offset = 0;
      _ref = this.options.groupings;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        len = _ref[i];
        if (i < groupingIndex) {
          offset += len;
        }
      }
      return offset + field[0].selectionEnd;
    };

    SegmentedCardNumberInputView.prototype.setGroupings = function(groupings, dontFocus) {
      var groupEl, groupLength, _caretPosition, _currentField, _i, _len, _value;
      _currentField = this._getFocusedField();
      _value = this.getValue();
      _caretPosition = 0;
      if (_currentField.length > 0) {
        _caretPosition = this._indexInValueAtFieldSelection(_currentField);
      }
      this.el.empty();
      for (_i = 0, _len = groupings.length; _i < _len; _i++) {
        groupLength = groupings[_i];
        groupEl = $("<input>").attr({
          type: 'text',
          pattern: '[0-9]*',
          size: groupLength,
          maxlength: groupLength,
          "class": "group" + groupLength,
          placeholder: new Array(groupLength + 1).join(this.options.placeholderChar)
        });
        this.el.append(groupEl);
      }
      this.options.groupings = groupings;
      this.setValue(_value);
      _currentField = this._focusFieldForValue([_caretPosition, _caretPosition], dontFocus);
      if ((_currentField != null) && _currentField[0].selectionEnd === _currentField[0].maxLength) {
        return this._focusField(_currentField.next(), 'start');
      }
    };

    SegmentedCardNumberInputView.prototype._focusFieldForValue = function(place, dontFocus) {
      var field, fieldOffset, fieldPosition, groupIndex, groupLength, value, _i, _lastStartPos, _len, _ref;
      value = this.getValue();
      if (place === 'start') {
        field = this.el.find('input').first();
        if (!dontFocus) {
          this._focusField(field, place);
        }
      } else if (place === 'end') {
        field = this.el.find('input').last();
        if (!dontFocus) {
          this._focusField(field, place);
        }
      } else {
        field = null;
        fieldOffset = null;
        _lastStartPos = 0;
        _ref = this.options.groupings;
        for (groupIndex = _i = 0, _len = _ref.length; _i < _len; groupIndex = ++_i) {
          groupLength = _ref[groupIndex];
          if (place[1] > _lastStartPos && place[1] <= _lastStartPos + groupLength) {
            field = $(this.el.find('input')[groupIndex]);
            fieldPosition = place[1] - _lastStartPos;
          }
          _lastStartPos += groupLength;
        }
        if ((field != null) && (fieldPosition != null)) {
          if (!dontFocus) {
            this._focusField(field, [fieldPosition, fieldPosition]);
          }
        } else {
          if (!dontFocus) {
            this._focusField(this.el.find('input'), 'end');
          }
        }
      }
      return field;
    };

    SegmentedCardNumberInputView.prototype._focusField = function(field, place) {
      var fieldLen;
      if (field.length !== 0) {
        field[0].focus();
        if ($(field[0]).is(':visible') && field[0] === document.activeElement) {
          if (place === 'start') {
            return field[0].setSelectionRange(0, 0);
          } else if (place === 'end') {
            fieldLen = field[0].maxLength;
            return field[0].setSelectionRange(fieldLen, fieldLen);
          } else {
            return field[0].setSelectionRange(place[0], place[1]);
          }
        }
      }
    };

    SegmentedCardNumberInputView.prototype.setValue = function(newValue) {
      var el, groupIndex, groupLength, groupVal, _i, _lastStartPos, _len, _ref, _results;
      _lastStartPos = 0;
      _ref = this.options.groupings;
      _results = [];
      for (groupIndex = _i = 0, _len = _ref.length; _i < _len; groupIndex = ++_i) {
        groupLength = _ref[groupIndex];
        el = $(this.el.find('input').get(groupIndex));
        groupVal = newValue.substr(_lastStartPos, groupLength);
        el.val(groupVal);
        _results.push(_lastStartPos += groupLength);
      }
      return _results;
    };

    SegmentedCardNumberInputView.prototype.getValue = function() {
      var buffer, el, _i, _len, _ref;
      buffer = "";
      _ref = this.el.find('input');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        buffer += $(el).val();
      }
      return buffer;
    };

    SegmentedCardNumberInputView.prototype.maxLength = function() {
      return this.options.groupings.reduce(function(a, b) {
        return a + b;
      });
    };

    SegmentedCardNumberInputView.prototype.bind = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).bind.apply(_ref, args);
    };

    SegmentedCardNumberInputView.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).trigger.apply(_ref, args);
    };

    SegmentedCardNumberInputView.prototype.show = function() {
      return this.el.show();
    };

    SegmentedCardNumberInputView.prototype.hide = function() {
      return this.el.hide();
    };

    SegmentedCardNumberInputView.prototype.addClass = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).addClass.apply(_ref, args);
    };

    SegmentedCardNumberInputView.prototype.removeClass = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).removeClass.apply(_ref, args);
    };

    return SegmentedCardNumberInputView;

  })();

  /*
  Skeuocard::ExpirationInputView
  */


  Skeuocard.prototype.ExpirationInputView = (function() {
    function ExpirationInputView(opts) {
      var _this = this;
      if (opts == null) {
        opts = {};
      }
      opts.pattern || (opts.pattern = "MM/YY");
      this.options = opts;
      this.date = null;
      this.el = $("<fieldset>");
      this.el.addClass('cc-field');
      this.el.delegate("input", "keydown", function(e) {
        return _this._onKeyDown(e);
      });
      this.el.delegate("input", "keyup", function(e) {
        return _this._onKeyUp(e);
      });
      this.el.delegate("input", "focus", function(e) {
        return _this.el.addClass('focus');
      });
      this.el.delegate("input", "blur", function(e) {
        return _this.el.removeClass('focus');
      });
    }

    ExpirationInputView.prototype.bind = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).bind.apply(_ref, args);
    };

    ExpirationInputView.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).trigger.apply(_ref, args);
    };

    ExpirationInputView.prototype._getFieldCaretPosition = function(el) {
      var input, sel, selLength;
      input = el.get(0);
      if (input.selectionEnd != null) {
        return input.selectionEnd;
      } else if (document.selection) {
        input.focus();
        sel = document.selection.createRange();
        selLength = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        return selLength;
      }
    };

    ExpirationInputView.prototype._setFieldCaretPosition = function(el, pos) {
      var input, range;
      input = el.get(0);
      if (input.createTextRange != null) {
        range = input.createTextRange();
        range.move("character", pos);
        return range.select();
      } else if (input.selectionStart != null) {
        input.focus();
        return input.setSelectionRange(pos, pos);
      }
    };

    ExpirationInputView.prototype.setPattern = function(pattern) {
      var char, groupings, i, patternParts, _currentLength, _i, _len;
      groupings = [];
      patternParts = pattern.split('');
      _currentLength = 0;
      for (i = _i = 0, _len = patternParts.length; _i < _len; i = ++_i) {
        char = patternParts[i];
        _currentLength++;
        if (patternParts[i + 1] !== char) {
          groupings.push([_currentLength, char]);
          _currentLength = 0;
        }
      }
      this.options.groupings = groupings;
      return this._setGroupings(this.options.groupings);
    };

    ExpirationInputView.prototype._setGroupings = function(groupings) {
      var fieldChars, group, groupChar, groupLength, input, sep, _i, _len, _startLength;
      fieldChars = ['D', 'M', 'Y'];
      this.el.empty();
      _startLength = 0;
      for (_i = 0, _len = groupings.length; _i < _len; _i++) {
        group = groupings[_i];
        groupLength = group[0];
        groupChar = group[1];
        if (__indexOf.call(fieldChars, groupChar) >= 0) {
          input = $('<input>').attr({
            type: 'text',
            pattern: '[0-9]*',
            placeholder: new Array(groupLength + 1).join(groupChar),
            maxlength: groupLength,
            "class": 'cc-exp-field-' + groupChar.toLowerCase() + ' group' + groupLength
          });
          input.data('fieldtype', groupChar);
          this.el.append(input);
        } else {
          sep = $('<span>').attr({
            "class": 'separator'
          });
          sep.html(new Array(groupLength + 1).join(groupChar));
          this.el.append(sep);
        }
      }
      this.groupEls = this.el.find('input');
      if (this.date != null) {
        return this._updateFieldValues();
      }
    };

    ExpirationInputView.prototype._zeroPadNumber = function(num, places) {
      var zero;
      zero = places - num.toString().length + 1;
      return Array(zero).join("0") + num;
    };

    ExpirationInputView.prototype._updateFieldValues = function() {
      var currentDate,
        _this = this;
      currentDate = this.date;
      if (!this.groupEls) {
        return this.setPattern(this.options.pattern);
      }
      return this.groupEls.each(function(i, _el) {
        var el, groupLength, year;
        el = $(_el);
        groupLength = parseInt(el.attr('maxlength'));
        switch (el.data('fieldtype')) {
          case 'M':
            return el.val(_this._zeroPadNumber(currentDate.getMonth() + 1, groupLength));
          case 'D':
            return el.val(_this._zeroPadNumber(currentDate.getDate(), groupLength));
          case 'Y':
            year = groupLength >= 4 ? currentDate.getFullYear() : currentDate.getFullYear().toString().substr(2, 4);
            return el.val(year);
        }
      });
    };

    ExpirationInputView.prototype.clear = function() {
      this.value = "";
      this.date = null;
      return this.groupEls.each(function() {
        return $(this).val('');
      });
    };

    ExpirationInputView.prototype.setValue = function(newDate) {
      this.date = newDate;
      return this._updateFieldValues();
    };

    ExpirationInputView.prototype.getValue = function() {
      return this.date;
    };

    ExpirationInputView.prototype.reconfigure = function(opts) {
      if (opts.pattern != null) {
        this.setPattern(opts.pattern);
      }
      if (opts.value != null) {
        return this.setValue(opts.value);
      }
    };

    ExpirationInputView.prototype._onKeyDown = function(e) {
      var groupCaretPos, groupEl, groupMaxLength, nextInputEl, prevInputEl, _ref;
      e.stopPropagation();
      groupEl = $(e.currentTarget);
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      prevInputEl = groupEl.prevAll('input').first();
      nextInputEl = groupEl.nextAll('input').first();
      if (e.which === 8 && groupCaretPos === 0 && !$.isEmptyObject(prevInputEl)) {
        prevInputEl.focus();
      }
      if ((_ref = e.which) === 37 || _ref === 38 || _ref === 39 || _ref === 40) {
        switch (e.which) {
          case 37:
            if (groupCaretPos === 0 && !$.isEmptyObject(prevInputEl)) {
              return prevInputEl.focus();
            }
            break;
          case 39:
            if (groupCaretPos === groupMaxLength && !$.isEmptyObject(nextInputEl)) {
              return nextInputEl.focus();
            }
            break;
          case 38:
            if (!$.isEmptyObject(groupEl.prev('input'))) {
              return prevInputEl.focus();
            }
            break;
          case 40:
            if (!$.isEmptyObject(groupEl.next('input'))) {
              return nextInputEl.focus();
            }
        }
      }
    };

    ExpirationInputView.prototype.getRawValue = function(fieldType) {
      return parseInt(this.el.find(".cc-exp-field-" + fieldType).val());
    };

    ExpirationInputView.prototype._onKeyUp = function(e) {
      var arrowKeys, dateObj, day, groupCaretPos, groupEl, groupMaxLength, groupValLength, month, nextInputEl, pattern, specialKeys, year, _ref, _ref1;
      e.stopPropagation();
      specialKeys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 144, 145, 224];
      arrowKeys = [37, 38, 39, 40];
      groupEl = $(e.currentTarget);
      groupMaxLength = parseInt(groupEl.attr('maxlength'));
      groupCaretPos = this._getFieldCaretPosition(groupEl);
      if (_ref = e.which, __indexOf.call(specialKeys, _ref) < 0) {
        groupValLength = groupEl.val().length;
        pattern = new RegExp('[^0-9]+', 'g');
        groupEl.val(groupEl.val().replace(pattern, ''));
        if (groupEl.val().length < groupValLength) {
          this._setFieldCaretPosition(groupEl, groupCaretPos - 1);
        } else {
          this._setFieldCaretPosition(groupEl, groupCaretPos);
        }
      }
      nextInputEl = groupEl.nextAll('input').first();
      if ((_ref1 = e.which, __indexOf.call(specialKeys, _ref1) < 0) && groupEl.val().length === groupMaxLength && !$.isEmptyObject(nextInputEl) && this._getFieldCaretPosition(groupEl) === groupMaxLength) {
        nextInputEl.focus();
      }
      day = this.getRawValue('d') || 1;
      month = this.getRawValue('m');
      year = this.getRawValue('y');
      if (month === 0 || year === 0) {
        this.date = null;
      } else {
        if (year < 2000) {
          year += 2000;
        }
        dateObj = new Date(year, month - 1, day);
        this.date = dateObj;
      }
      this.trigger("keyup", [this]);
      return false;
    };

    ExpirationInputView.prototype._inputGroupEls = function() {
      return this.el.find("input");
    };

    ExpirationInputView.prototype.show = function() {
      return this.el.show();
    };

    ExpirationInputView.prototype.hide = function() {
      return this.el.hide();
    };

    return ExpirationInputView;

  })();

  /*
  Skeuocard::TextInputView
  */


  Skeuocard.prototype.TextInputView = (function() {
    function TextInputView(opts) {
      var _this = this;
      this.el = $('<div>');
      this.inputEl = $("<input>").attr({
        type: 'text',
        placeholder: opts.placeholder,
        "class": opts["class"]
      });
      this.el.append(this.inputEl);
      this.el.addClass('cc-field');
      this.options = opts;
      this.el.delegate("input", "focus", function(e) {
        return _this.el.addClass('focus');
      });
      this.el.delegate("input", "blur", function(e) {
        return _this.el.removeClass('focus');
      });
      this.el.delegate("input", "keyup", function(e) {
        e.stopPropagation();
        return _this.trigger('keyup', [_this]);
      });
    }

    TextInputView.prototype.clear = function() {
      return this.inputEl.val("");
    };

    TextInputView.prototype.attr = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.inputEl).attr.apply(_ref, args);
    };

    TextInputView.prototype.setValue = function(newValue) {
      return this.inputEl.val(newValue);
    };

    TextInputView.prototype.getValue = function() {
      return this.inputEl.val();
    };

    TextInputView.prototype.bind = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).bind.apply(_ref, args);
    };

    TextInputView.prototype.trigger = function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.el).trigger.apply(_ref, args);
    };

    TextInputView.prototype.show = function() {
      return this.el.show();
    };

    TextInputView.prototype.hide = function() {
      return this.el.hide();
    };

    return TextInputView;

  })();

  /*
  Skeuocard::CardProduct
  */


  Skeuocard.prototype.CardProduct = (function() {
    CardProduct._registry = [];

    CardProduct.create = function(opts) {
      return this._registry.push(new Skeuocard.prototype.CardProduct(opts));
    };

    CardProduct.firstMatchingShortname = function(shortname) {
      var card, _i, _len, _ref;
      _ref = this._registry;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        card = _ref[_i];
        if (card.attrs.companyShortname === shortname) {
          return card;
        }
      }
      return null;
    };

    CardProduct.firstMatchingNumber = function(number) {
      var card, combinedOptions, variation, _i, _len, _ref;
      _ref = this._registry;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        card = _ref[_i];
        if (card.pattern.test(number)) {
          if ((variation = card.firstVariationMatchingNumber(number))) {
            combinedOptions = $.extend({}, card.attrs, variation);
            return new Skeuocard.prototype.CardProduct(combinedOptions);
          }
          return new Skeuocard.prototype.CardProduct(card.attrs);
        }
      }
      return null;
    };

    function CardProduct(attrs) {
      this.attrs = $.extend({}, attrs);
      this.pattern = this.attrs.pattern;
      this._variances = [];
      this.name = {
        isFilled: this._isCardNameFilled.bind(this),
        isValid: this._isCardNameValid.bind(this)
      };
      this.number = {
        isFilled: this._isCardNumberFilled.bind(this),
        isValid: this._isCardNumberValid.bind(this)
      };
      this.exp = {
        isFilled: this._isCardExpirationFilled.bind(this),
        isValid: this._isCardExpirationValid.bind(this)
      };
      this.cvc = {
        isFilled: this._isCardCVCFilled.bind(this),
        isValid: this._isCardCVCValid.bind(this)
      };
    }

    CardProduct.prototype.createVariation = function(attrs) {
      return this._variances.push(attrs);
    };

    CardProduct.prototype.firstVariationMatchingNumber = function(number) {
      var variance, _i, _len, _ref;
      _ref = this._variances;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        variance = _ref[_i];
        if (variance.pattern.test(number)) {
          return variance;
        }
      }
      return null;
    };

    CardProduct.prototype.fieldsForLayoutFace = function(faceName) {
      var face, fieldName, _ref, _results;
      _ref = this.attrs.layout;
      _results = [];
      for (fieldName in _ref) {
        face = _ref[fieldName];
        if (face === faceName) {
          _results.push(fieldName);
        }
      }
      return _results;
    };

    CardProduct.prototype._id = function() {
      var ident;
      ident = this.attrs.companyShortname;
      if (this.attrs.issuerShortname != null) {
        ident += this.attrs.issuerShortname;
      }
      return ident;
    };

    CardProduct.prototype.eql = function(otherCardProduct) {
      return (otherCardProduct != null ? otherCardProduct._id() : void 0) === this._id();
    };

    CardProduct.prototype._daysInMonth = function(m, y) {
      switch (m) {
        case 1:
          if ((y % 4 === 0 && y % 100) || y % 400 === 0) {
            return 29;
          } else {
            return 28;
          }
        case 3:
        case 5:
        case 8:
        case 10:
          return 30;
        default:
          return 31;
      }
    };

    CardProduct.prototype._isCardNumberFilled = function(number) {
      var _ref;
      if (this.attrs.cardNumberLength != null) {
        return (_ref = number.length, __indexOf.call(this.attrs.cardNumberLength, _ref) >= 0);
      }
    };

    CardProduct.prototype._isCardExpirationFilled = function(exp) {
      var currentDate, day, month, year;
      currentDate = Skeuocard.currentDate;
      if (!((exp != null) && (exp.getMonth != null) && (exp.getFullYear != null))) {
        return false;
      }
      day = exp.getDate();
      month = exp.getMonth();
      year = exp.getFullYear();
      return (day > 0 && day <= this._daysInMonth(month, year)) && (month >= 0 && month <= 11) && (year >= 1900 && year <= currentDate.getFullYear() + 10);
    };

    CardProduct.prototype._isCardCVCFilled = function(cvc) {
      return cvc.length === this.attrs.cvcLength;
    };

    CardProduct.prototype._isCardNameFilled = function(name) {
      return name.length > 0;
    };

    CardProduct.prototype._isCardNumberValid = function(number) {
      return /^\d+$/.test(number) && (this.attrs.validateLuhn === false || this._isValidLuhn(number)) && this._isCardNumberFilled(number);
    };

    CardProduct.prototype._isCardExpirationValid = function(exp) {
      var currentDate, day, isDateInFuture, month, year;
      if (!((exp != null) && (exp.getMonth != null) && (exp.getFullYear != null))) {
        return false;
      }
      currentDate = Skeuocard.currentDate;
      day = exp.getDate();
      month = exp.getMonth();
      year = exp.getFullYear();
      isDateInFuture = (year === currentDate.getFullYear() && month >= currentDate.getMonth()) || year > currentDate.getFullYear();
      return isDateInFuture && this._isCardExpirationFilled(exp);
    };

    CardProduct.prototype._isCardCVCValid = function(cvc) {
      return this._isCardCVCFilled(cvc);
    };

    CardProduct.prototype._isCardNameValid = function(name) {
      return this._isCardNameFilled(name);
    };

    CardProduct.prototype._isValidLuhn = function(number) {
      var alt, i, num, sum, _i, _ref;
      sum = 0;
      alt = false;
      for (i = _i = _ref = number.length - 1; _i >= 0; i = _i += -1) {
        num = parseInt(number.charAt(i), 10);
        if (isNaN(num)) {
          return false;
        }
        if (alt) {
          num *= 2;
          if (num > 9) {
            num = (num % 10) + 1;
          }
        }
        alt = !alt;
        sum += num;
      }
      return sum % 10 === 0;
    };

    return CardProduct;

  })();

  /*
  # Seed CardProducts.
  */


  Skeuocard.prototype.CardProduct.create({
    pattern: /^(36|38|30[0-5])/,
    companyName: "Diners Club",
    companyShortname: "dinersclubintl",
    cardNumberGrouping: [4, 6, 4],
    cardNumberLength: [14],
    expirationFormat: "MM/YY",
    cvcLength: 3,
    validateLuhn: true,
    layout: {
      number: 'front',
      exp: 'front',
      name: 'front',
      cvc: 'back'
    }
  });

  Skeuocard.prototype.CardProduct.create({
    pattern: /^35/,
    companyName: "JCB",
    companyShortname: "jcb",
    cardNumberGrouping: [4, 4, 4, 4],
    cardNumberLength: [16],
    expirationFormat: "MM/'YY",
    cvcLength: 3,
    validateLuhn: true,
    layout: {
      number: 'front',
      exp: 'front',
      name: 'front',
      cvc: 'back'
    }
  });

  Skeuocard.prototype.CardProduct.create({
    pattern: /^3[47]/,
    companyName: "American Express",
    companyShortname: "amex",
    cardNumberGrouping: [4, 6, 5],
    cardNumberLength: [15],
    expirationFormat: "MM/YY",
    cvcLength: 4,
    validateLuhn: true,
    layout: {
      number: 'front',
      exp: 'front',
      name: 'front',
      cvc: 'front'
    }
  });

  Skeuocard.prototype.CardProduct.create({
    pattern: /^(6706|6771|6709)/,
    companyName: "Laser Card Services Ltd.",
    companyShortname: "laser",
    cardNumberGrouping: [4, 4, 4, 4],
    cardNumberLength: [16, 17, 18, 19],
    expirationFormat: "MM/YY",
    validateLuhn: true,
    cvcLength: 3,
    layout: {
      number: 'front',
      exp: 'front',
      name: 'front',
      cvc: 'back'
    }
  });

  Skeuocard.prototype.CardProduct.create({
    pattern: /^4/,
    companyName: "Visa",
    companyShortname: "visa",
    cardNumberGrouping: [4, 4, 4, 4],
    cardNumberLength: [13, 14, 15, 16],
    expirationFormat: "MM/YY",
    validateLuhn: true,
    cvcLength: 3,
    layout: {
      number: 'front',
      exp: 'front',
      name: 'front',
      cvc: 'back'
    }
  });

  Skeuocard.prototype.CardProduct.create({
    pattern: /^(62|88)/,
    companyName: "China UnionPay",
    companyShortname: "unionpay",
    cardNumberGrouping: [19],
    cardNumberLength: [16, 17, 18, 19],
    expirationFormat: "MM/YY",
    validateLuhn: false,
    cvcLength: 3,
    layout: {
      number: 'front',
      exp: 'front',
      name: 'front',
      cvc: 'back'
    }
  });

  Skeuocard.prototype.CardProduct.create({
    pattern: /^5[1-5]/,
    companyName: "Mastercard",
    companyShortname: "mastercard",
    cardNumberGrouping: [4, 4, 4, 4],
    cardNumberLength: [16],
    expirationFormat: "MM/YY",
    validateLuhn: true,
    cvcLength: 3,
    layout: {
      number: 'front',
      exp: 'front',
      name: 'front',
      cvc: 'back'
    }
  });

  Skeuocard.prototype.CardProduct.create({
    pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
    companyName: "Maestro (MasterCard)",
    companyShortname: "maestro",
    cardNumberGrouping: [4, 4, 4, 4],
    cardNumberLength: [12, 13, 14, 15, 16, 17, 18, 19],
    expirationFormat: "MM/YY",
    validateLuhn: true,
    cvcLength: 3,
    layout: {
      number: 'front',
      exp: 'front',
      name: 'front',
      cvc: 'back'
    }
  });

  Skeuocard.prototype.CardProduct.create({
    pattern: /^(6011|65|64[4-9]|622)/,
    companyName: "Discover",
    companyShortname: "discover",
    cardNumberGrouping: [4, 4, 4, 4],
    cardNumberLength: [16],
    expirationFormat: "MM/YY",
    validateLuhn: true,
    cvcLength: 3,
    layout: {
      number: 'front',
      exp: 'front',
      name: 'front',
      cvc: 'back'
    }
  });

  visaProduct = Skeuocard.prototype.CardProduct.firstMatchingShortname('visa');

  visaProduct.createVariation({
    pattern: /^414720/,
    issuingAuthority: "Chase",
    issuerName: "Chase Sapphire Card",
    issuerShortname: "chase-sapphire",
    layout: {
      name: 'front',
      number: 'front',
      exp: 'front',
      cvc: 'front'
    }
  });

}).call(this);

(function(){var $,Skeuocard,visaProduct,__slice=[].slice,__indexOf=[].indexOf||function(item){for(var i=0,l=this.length;l>i;i++)if(i in this&&this[i]===item)return i;return-1};$=jQuery,Skeuocard=function(){function Skeuocard(el,opts){var optDefaults;null==opts&&(opts={}),this.el={container:$(el),underlyingFields:{}},this._inputViews={},this._inputViewsByFace={front:[],back:[]},this._tabViews={},this._state={},this.product=null,this.visibleFace="front",optDefaults={debug:!1,dontFocus:!1,acceptedCardProducts:null,cardNumberPlaceholderChar:"X",genericPlaceholder:"XXXX XXXX XXXX XXXX",typeInputSelector:'[name="cc_type"]',numberInputSelector:'[name="cc_number"]',expMonthInputSelector:'[name="cc_exp_month"]',expYearInputSelector:'[name="cc_exp_year"]',nameInputSelector:'[name="cc_name"]',cvcInputSelector:'[name="cc_cvc"]',initialValues:{},validationState:{},strings:{hiddenFaceFillPrompt:"<strong>Click here</strong> to <br>fill in the other side.",hiddenFaceErrorWarning:"There's a problem on the other side.",hiddenFaceSwitchPrompt:"Forget something?<br> Flip the card over."}},this.options=$.extend(optDefaults,opts),this._conformDOM(),this._bindInputEvents(),this._importImplicitOptions(),this.render()}return Skeuocard.currentDate=new Date,Skeuocard.prototype._log=function(){var msg;return msg=1<=arguments.length?__slice.call(arguments,0):[],("undefined"!=typeof console&&null!==console?console.log:void 0)&&this.options.debug&&null!=this.options.debug?console.log.apply(console,["[skeuocard]"].concat(__slice.call(msg))):void 0},Skeuocard.prototype.trigger=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el.container).trigger.apply(_ref,args)},Skeuocard.prototype.bind=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el.container).bind.apply(_ref,args)},Skeuocard.prototype._conformDOM=function(){return this.el.container.removeClass("no-js"),this.el.container.addClass("skeuocard js"),this.el.container.find("> :not(input,select,textarea)").remove(),this.el.container.find("> input,select,textarea").hide(),this.el.underlyingFields={type:this.el.container.find(this.options.typeInputSelector),number:this.el.container.find(this.options.numberInputSelector),expMonth:this.el.container.find(this.options.expMonthInputSelector),expYear:this.el.container.find(this.options.expYearInputSelector),name:this.el.container.find(this.options.nameInputSelector),cvc:this.el.container.find(this.options.cvcInputSelector)},this.el.front=$("<div>").attr({"class":"face front"}),this.el.back=$("<div>").attr({"class":"face back"}),this.el.cardBody=$("<div>").attr({"class":"card-body"}),this.el.front.appendTo(this.el.cardBody),this.el.back.appendTo(this.el.cardBody),this.el.cardBody.appendTo(this.el.container),this._tabViews.front=new Skeuocard.prototype.FlipTabView(this,"front",{strings:this.options.strings}),this._tabViews.back=new Skeuocard.prototype.FlipTabView(this,"back",{strings:this.options.strings}),this.el.front.prepend(this._tabViews.front.el),this.el.back.prepend(this._tabViews.back.el),this._tabViews.front.hide(),this._tabViews.back.hide(),this._inputViews={number:new this.SegmentedCardNumberInputView,exp:new this.ExpirationInputView({currentDate:this.options.currentDate}),name:new this.TextInputView({"class":"cc-name",placeholder:"YOUR NAME"}),cvc:new this.TextInputView({"class":"cc-cvc",placeholder:"XXX",requireMaxLength:!0})},this._inputViews.number.el.addClass("cc-number"),this._inputViews.number.el.appendTo(this.el.front),this._inputViews.name.el.appendTo(this.el.front),this._inputViews.exp.el.addClass("cc-exp"),this._inputViews.exp.el.appendTo(this.el.front),this._inputViews.cvc.el.appendTo(this.el.back),this.el.container},Skeuocard.prototype._importImplicitOptions=function(){var fieldEl,fieldName,_initialExp,_ref,_this=this;_ref=this.el.underlyingFields;for(fieldName in _ref)fieldEl=_ref[fieldName],null==this.options.initialValues[fieldName]?this.options.initialValues[fieldName]=fieldEl.val():(this.options.initialValues[fieldName]=this.options.initialValues[fieldName].toString(),this._setUnderlyingValue(fieldName,this.options.initialValues[fieldName])),this.options.initialValues[fieldName].length>0&&(this._state.initiallyFilled=!0),null==this.options.validationState[fieldName]&&(this.options.validationState[fieldName]=!fieldEl.hasClass("invalid"));return null==this.options.acceptedCardProducts&&(this.options.acceptedCardProducts=[],this.el.underlyingFields.type.find("option").each(function(i,_el){var el,shortname;return el=$(_el),shortname=el.attr("data-sc-type")||el.attr("value"),_this.options.acceptedCardProducts.push(shortname)})),this.options.initialValues.number.length>0&&this.set("number",this.options.initialValues.number),this.options.initialValues.name.length>0&&this.set("name",this.options.initialValues.name),this.options.initialValues.cvc.length>0&&this.set("cvc",this.options.initialValues.cvc),this.options.initialValues.expYear.length>0&&this.options.initialValues.expMonth.length>0&&(_initialExp=new Date(parseInt(this.options.initialValues.expYear),parseInt(this.options.initialValues.expMonth)-1,1),this.set("exp",_initialExp)),this._updateValidationForFace("front"),this._updateValidationForFace("back")},Skeuocard.prototype.set=function(field,newValue){return this._inputViews[field].setValue(newValue),this._inputViews[field].trigger("valueChanged",this._inputViews[field])},Skeuocard.prototype._bindInputEvents=function(){var _expirationChange,_this=this;return this.el.underlyingFields.number.bind("change",function(){return _this._inputViews.number.setValue(_this._getUnderlyingValue("number")),_this.render()}),_expirationChange=function(){var month,year;return month=parseInt(_this._getUnderlyingValue("expMonth")),year=parseInt(_this._getUnderlyingValue("expYear")),_this._inputViews.exp.setValue(new Date(year,month-1)),_this.render()},this.el.underlyingFields.expMonth.bind("change",_expirationChange),this.el.underlyingFields.expYear.bind("change",_expirationChange),this.el.underlyingFields.name.bind("change",function(){return _this._inputViews.exp.setValue(_this._getUnderlyingValue("name")),_this.render()}),this.el.underlyingFields.cvc.bind("change",function(){return _this._inputViews.exp.setValue(_this._getUnderlyingValue("cvc")),_this.render()}),this._inputViews.number.bind("change valueChanged",function(e,input){var cardNumber,matchedProduct,number,previousProduct,_ref,_ref1;return cardNumber=input.getValue(),_this._setUnderlyingValue("number",cardNumber),_this._updateValidation("number",cardNumber),number=_this._getUnderlyingValue("number"),matchedProduct=Skeuocard.prototype.CardProduct.firstMatchingNumber(number),(null!=(_ref=_this.product)?_ref.eql(matchedProduct):void 0)?void 0:(_this._log("Product will change:",_this.product,"=>",matchedProduct),_ref1=null!=matchedProduct?matchedProduct.attrs.companyShortname:void 0,__indexOf.call(_this.options.acceptedCardProducts,_ref1)>=0?(_this.trigger("productWillChange.skeuocard",[_this,_this.product,matchedProduct]),previousProduct=_this.product,_this.el.container.removeClass("unaccepted"),_this._renderProduct(matchedProduct),_this.product=matchedProduct):null!=matchedProduct?(_this.trigger("productWillChange.skeuocard",[_this,_this.product,null]),_this.el.container.addClass("unaccepted"),_this._renderProduct(null),_this.product=null):(_this.trigger("productWillChange.skeuocard",[_this,_this.product,null]),_this.el.container.removeClass("unaccepted"),_this._renderProduct(null),_this.product=null),_this.trigger("productDidChange.skeuocard",[_this,previousProduct,_this.product]))}),this._inputViews.exp.bind("keyup valueChanged",function(e,input){var newDate;return newDate=input.getValue(),_this._updateValidation("exp",newDate),null!=newDate?(_this._setUnderlyingValue("expMonth",newDate.getMonth()+1),_this._setUnderlyingValue("expYear",newDate.getFullYear())):void 0}),this._inputViews.name.bind("keyup valueChanged",function(e,input){var value;return value=input.getValue(),_this._setUnderlyingValue("name",value),_this._updateValidation("name",value)}),this._inputViews.cvc.bind("keyup valueChanged",function(e,input){var value;return value=input.getValue(),_this._setUnderlyingValue("cvc",value),_this._updateValidation("cvc",value)}),this.el.container.delegate("input","keyup keydown",this._handleFieldTab.bind(this)),this._tabViews.front.el.click(function(){return _this.flip()}),this._tabViews.back.el.click(function(){return _this.flip()})},Skeuocard.prototype._handleFieldTab=function(e){var backFieldEls,currentFieldEl,frontFieldEls,_currentFace,_oppositeFace;return 9===e.which&&(currentFieldEl=$(e.currentTarget),_oppositeFace="front"===this.visibleFace?"back":"front",_currentFace="front"===this.visibleFace?"front":"back",backFieldEls=this.el[_oppositeFace].find("input"),frontFieldEls=this.el[_currentFace].find("input"),"front"===this.visibleFace&&this.el.front.hasClass("filled")&&backFieldEls.length>0&&frontFieldEls.index(currentFieldEl)===frontFieldEls.length-1&&!e.shiftKey&&(this.flip(),backFieldEls.first().focus(),e.preventDefault()),"back"===this.visibleFace&&e.shiftKey&&(this.flip(),backFieldEls.last().focus(),e.preventDefault())),!0},Skeuocard.prototype._updateValidation=function(fieldName,newValue){var fillStateChanged,isFilled,isFixed,isValid,needsFix,validationStateChanged;return null==this.product?!1:(isFilled=this.product[fieldName].isFilled(newValue),needsFix=null!=this.options.validationState[fieldName]==!1,isFixed=null!=this.options.initialValues[fieldName]&&newValue!==this.options.initialValues[fieldName],isValid=this.product[fieldName].isValid(newValue)&&(needsFix&&isFixed||!0),fillStateChanged=this._state[""+fieldName+"Filled"]!==isFilled,validationStateChanged=this._state[""+fieldName+"Valid"]!==isValid,fillStateChanged&&(this.trigger("fieldFillStateWillChange.skeuocard",[this,fieldName,isFilled]),this._inputViews[fieldName].el.toggleClass("filled",isFilled),this._state[""+fieldName+"Filled"]=isFilled,this.trigger("fieldFillStateDidChange.skeuocard",[this,fieldName,isFilled])),validationStateChanged&&(this.trigger("fieldValidationStateWillChange.skeuocard",[this,fieldName,isValid]),this._inputViews[fieldName].el.toggleClass("valid",isValid),this._inputViews[fieldName].el.toggleClass("invalid",!isValid),this._state[""+fieldName+"Valid"]=isValid,this.trigger("fieldValidationStateDidChange.skeuocard",[this,fieldName,isValid])),this._updateValidationForFace(this.visibleFace))},Skeuocard.prototype._updateValidationForFace=function(face){var fieldsFilled,fieldsValid,fillStateChanged,isFilled,isValid,iv,validationStateChanged;return fieldsFilled=function(){var _i,_len,_ref,_results;for(_ref=this._inputViewsByFace[face],_results=[],_i=0,_len=_ref.length;_len>_i;_i++)iv=_ref[_i],_results.push(iv.el.hasClass("filled"));return _results}.call(this).every(Boolean),fieldsValid=function(){var _i,_len,_ref,_results;for(_ref=this._inputViewsByFace[face],_results=[],_i=0,_len=_ref.length;_len>_i;_i++)iv=_ref[_i],_results.push(iv.el.hasClass("valid"));return _results}.call(this).every(Boolean),isFilled=fieldsFilled&&null!=this.product||this._state.initiallyFilled||!1,isValid=fieldsValid&&null!=this.product,fillStateChanged=this._state[""+face+"Filled"]!==isFilled,validationStateChanged=this._state[""+face+"Valid"]!==isValid,fillStateChanged&&(this.trigger("faceFillStateWillChange.skeuocard",[this,face,isFilled]),this.el[face].toggleClass("filled",isFilled),this._state[""+face+"Filled"]=isFilled,this.trigger("faceFillStateDidChange.skeuocard",[this,face,isFilled])),validationStateChanged?(this.trigger("faceValidationStateWillChange.skeuocard",[this,face,isValid]),this.el[face].toggleClass("valid",isValid),this.el[face].toggleClass("invalid",!isValid),this._state[""+face+"Valid"]=isValid,this.trigger("faceValidationStateDidChange.skeuocard",[this,face,isValid])):void 0},Skeuocard.prototype._renderProduct=function(product){var destFace,fieldName,focused,view,viewEl,_ref,_ref1;if(this._log("[_renderProduct]","Rendering product:",product),this.el.container.removeClass(function(index,css){return(css.match(/\b(product|issuer)-\S+/g)||[]).join(" ")}),null!=(null!=product?product.attrs.companyShortname:void 0)&&this.el.container.addClass("product-"+product.attrs.companyShortname),null!=(null!=product?product.attrs.issuerShortname:void 0)&&this.el.container.addClass("issuer-"+product.attrs.issuerShortname),this._setUnderlyingValue("type",(null!=product?product.attrs.companyShortname:void 0)||null),this._inputViews.number.setGroupings((null!=product?product.attrs.cardNumberGrouping:void 0)||[this.options.genericPlaceholder.length],this.options.dontFocus),delete this.options.dontFocus,null!=product){this._inputViews.exp.reconfigure({pattern:(null!=product?product.attrs.expirationFormat:void 0)||"MM/YY"}),this._inputViews.cvc.attr({maxlength:product.attrs.cvcLength,placeholder:new Array(product.attrs.cvcLength+1).join(this.options.cardNumberPlaceholderChar)}),this._inputViewsByFace={front:[],back:[]},focused=$("input:focus"),_ref=product.attrs.layout;for(fieldName in _ref)destFace=_ref[fieldName],this._log("Moving",fieldName,"to",destFace),viewEl=this._inputViews[fieldName].el.detach(),viewEl.appendTo(this.el[destFace]),this._inputViewsByFace[destFace].push(this._inputViews[fieldName]),this._inputViews[fieldName].show();setTimeout(function(){var fieldEl,fieldLength;return null!=(fieldEl=focused.first())?(fieldLength=fieldEl[0].maxLength,fieldEl.focus(),fieldEl[0].setSelectionRange(fieldLength,fieldLength)):void 0},10)}else{_ref1=this._inputViews;for(fieldName in _ref1)view=_ref1[fieldName],"number"!==fieldName&&view.hide()}return product},Skeuocard.prototype._renderValidation=function(){var fieldName,fieldView,_ref,_results;_ref=this._inputViews,_results=[];for(fieldName in _ref)fieldView=_ref[fieldName],_results.push(this._updateValidation(fieldName,fieldView.getValue()));return _results},Skeuocard.prototype.render=function(){return this._renderProduct(this.product),this._renderValidation()},Skeuocard.prototype.flip=function(){var surfaceName,targetFace;return targetFace="front"===this.visibleFace?"back":"front",this.trigger("faceWillBecomeVisible.skeuocard",[this,targetFace]),this.visibleFace=targetFace,this.el.cardBody.toggleClass("flip"),surfaceName="front"===this.visibleFace?"front":"back",this.el[surfaceName].find(".cc-field").not(".filled").find("input").first().focus(),this.trigger("faceDidBecomeVisible.skeuocard",[this,targetFace])},Skeuocard.prototype._setUnderlyingValue=function(field,newValue){var fieldEl,remapAttrKey,_newValue,_this=this;if(fieldEl=this.el.underlyingFields[field],_newValue=(newValue||"").toString(),null==fieldEl)throw"Set underlying value of unknown field: "+field+".";return this.trigger("change.skeuocard",[this]),fieldEl.is("select")?(remapAttrKey="data-sc-"+field.toLowerCase(),fieldEl.find("option").each(function(i,_el){var optionEl;return optionEl=$(_el),_newValue===(optionEl.attr(remapAttrKey)||optionEl.attr("value"))?_this.el.underlyingFields[field].val(optionEl.attr("value")):void 0})):this.el.underlyingFields[field].val(_newValue)},Skeuocard.prototype._getUnderlyingValue=function(field){var _ref;return null!=(_ref=this.el.underlyingFields[field])?_ref.val():void 0},Skeuocard.prototype.isValid=function(){return!this.el.front.hasClass("invalid")&&!this.el.back.hasClass("invalid")},Skeuocard}(),window.Skeuocard=Skeuocard,Skeuocard.prototype.FlipTabView=function(){function FlipTabView(sc,face,opts){var _this=this;null==opts&&(opts={}),this.card=sc,this.face=face,this.el=$('<div class="flip-tab '+face+'"><p></p></div>'),this.options=opts,this._state={},this.card.bind("faceFillStateWillChange.skeuocard",this._faceStateChanged.bind(this)),this.card.bind("faceValidationStateWillChange.skeuocard",this._faceValidationChanged.bind(this)),this.card.bind("productWillChange.skeuocard",function(e,card,prevProduct,newProduct){return null==newProduct?_this.hide():void 0})}return FlipTabView.prototype._faceStateChanged=function(e,card,face,isFilled){var oppositeFace;return oppositeFace="front"===face?"back":"front",isFilled===!0&&this.card._inputViewsByFace[oppositeFace].length>0&&this.show(),face!==this.face&&(this._state.opposingFaceFilled=isFilled),this._state.opposingFaceFilled!==!0?this.warn(this.options.strings.hiddenFaceFillPrompt,!0):void 0},FlipTabView.prototype._faceValidationChanged=function(e,card,face,isValid){return face!==this.face&&(this._state.opposingFaceValid=isValid),this._state.opposingFaceValid?this.prompt(this.options.strings.hiddenFaceSwitchPrompt):this._state.opposingFaceFilled?this.warn(this.options.strings.hiddenFaceErrorWarning):this.warn(this.options.strings.hiddenFaceFillPrompt)},FlipTabView.prototype._setText=function(text){return this.el.find("p").first().html(text)},FlipTabView.prototype.warn=function(message){return this._resetClasses(),this._setText(message),this.el.addClass("warn")},FlipTabView.prototype.prompt=function(message){return this._resetClasses(),this._setText(message),this.el.addClass("prompt")},FlipTabView.prototype._resetClasses=function(){return this.el.removeClass("warn"),this.el.removeClass("prompt")},FlipTabView.prototype.show=function(){return this.el.show()},FlipTabView.prototype.hide=function(){return this.el.hide()},FlipTabView}(),Skeuocard.prototype.SegmentedCardNumberInputView=function(){function SegmentedCardNumberInputView(opts){null==opts&&(opts={}),this.optDefaults={value:"",groupings:[19],placeholderChar:"X"},this.options=$.extend({},this.optDefaults,opts),this._state={selectingAll:!1},this._buildDOM(),this.setGroupings(this.options.groupings)}return SegmentedCardNumberInputView.prototype._digits=["0","1","2","3","4","5","6","7","8","9"],SegmentedCardNumberInputView.prototype._keys={backspace:8,tab:9,enter:13,del:46,arrowLeft:37,arrowUp:38,arrowRight:39,arrowDown:40,arrows:[37,38,39,40],command:16,alt:17},SegmentedCardNumberInputView.prototype._specialKeys=[8,9,13,46,37,38,39,40,16,17],SegmentedCardNumberInputView.prototype._buildDOM=function(){var _this=this;return this.el=$("<fieldset>"),this.el.addClass("cc-field"),this.el.delegate("input","keypress",this._handleGroupKeyPress.bind(this)),this.el.delegate("input","keydown",this._handleGroupKeyDown.bind(this)),this.el.delegate("input","keyup",this._handleGroupKeyUp.bind(this)),this.el.delegate("input","paste",this._handleGroupPaste.bind(this)),this.el.delegate("input","change",this._handleGroupChange.bind(this)),this.el.delegate("input","focus",function(){return _this.el.addClass("focus")}),this.el.delegate("input","blur",function(){return _this.el.removeClass("focus")})},SegmentedCardNumberInputView.prototype._handleGroupKeyDown=function(e){var currentTarget,cursorEnd,cursorStart,inputGroupEl,inputMaxLength,nextInputEl,prevInputEl,_ref;if(e.ctrlKey||e.metaKey)return this._handleModifiedKeyDown(e);switch(inputGroupEl=$(e.currentTarget),currentTarget=e.currentTarget,cursorStart=currentTarget.selectionStart,cursorEnd=currentTarget.selectionEnd,inputMaxLength=currentTarget.maxLength,prevInputEl=inputGroupEl.prevAll("input"),nextInputEl=inputGroupEl.nextAll("input"),e.which){case this._keys.backspace:prevInputEl.length>0&&0===cursorEnd&&this._focusField(prevInputEl.first(),"end");break;case this._keys.arrowUp:cursorEnd===inputMaxLength?this._focusField(inputGroupEl,"start"):this._focusField(inputGroupEl.prev(),"end"),e.preventDefault();break;case this._keys.arrowDown:cursorEnd===inputMaxLength?this._focusField(inputGroupEl.next(),"start"):this._focusField(inputGroupEl,"end"),e.preventDefault();break;case this._keys.arrowLeft:0===cursorEnd&&(this._focusField(inputGroupEl.prev(),"end"),e.preventDefault());break;case this._keys.arrowRight:cursorEnd===inputMaxLength&&(this._focusField(inputGroupEl.next(),"start"),e.preventDefault());break;default:_ref=e.which,__indexOf.call(this._specialKeys,_ref)>=0||cursorStart!==inputMaxLength||cursorEnd!==inputMaxLength||0===nextInputEl.length||this._focusField(nextInputEl.first(),"start")}return!0},SegmentedCardNumberInputView.prototype._handleGroupKeyPress=function(e){var inputGroupEl,isDigit,_ref,_ref1;return inputGroupEl=$(e.currentTarget),_ref=String.fromCharCode(e.which),isDigit=__indexOf.call(this._digits,_ref)>=0,e.ctrlKey||e.metaKey?!0:0===e.which?!0:!e.shiftKey&&(_ref1=e.which,__indexOf.call(this._specialKeys,_ref1)>=0)||isDigit?!0:(e.preventDefault(),!1)},SegmentedCardNumberInputView.prototype._handleGroupKeyUp=function(e){var currentTarget,cursorEnd,cursorStart,inputGroupEl,inputMaxLength,nextInputEl,_ref,_ref1,_ref2;return inputGroupEl=$(e.currentTarget),currentTarget=e.currentTarget,inputMaxLength=currentTarget.maxLength,cursorStart=currentTarget.selectionStart,cursorEnd=currentTarget.selectionEnd,nextInputEl=inputGroupEl.nextAll("input"),e.ctrlKey||e.metaKey?!0:(this._state.selectingAll&&(_ref=e.which,__indexOf.call(this._specialKeys,_ref)>=0)&&e.which!==this._keys.command&&e.which!==this._keys.alt&&this._endSelectAll(),_ref1=e.which,__indexOf.call(this._specialKeys,_ref1)>=0||e.shiftKey&&e.which===this._keys.tab||cursorStart!==inputMaxLength||cursorEnd!==inputMaxLength||0===nextInputEl.length||this._focusField(nextInputEl.first(),"start"),e.shiftKey&&(_ref2=e.which,__indexOf.call(this._specialKeys,_ref2)>=0)||this.trigger("change",[this]),!0)},SegmentedCardNumberInputView.prototype._handleModifiedKeyDown=function(e){var char;switch(char=String.fromCharCode(e.which)){case"a":case"A":return this._beginSelectAll(),e.preventDefault()}},SegmentedCardNumberInputView.prototype._handleGroupPaste=function(){var _this=this;return setTimeout(function(){var newValue;return newValue=_this.getValue().replace(/[^0-9]+/g,""),_this._state.selectingAll&&_this._endSelectAll(),_this.setValue(newValue),_this.trigger("change",[_this])},50)},SegmentedCardNumberInputView.prototype._handleGroupChange=function(e){return e.stopPropagation()},SegmentedCardNumberInputView.prototype._getFocusedField=function(){return this.el.find("input:focus")},SegmentedCardNumberInputView.prototype._beginSelectAll=function(){var fieldEl;return this.el.hasClass("selecting-all")?(fieldEl=this.el.find("input"),fieldEl[0].setSelectionRange(0,fieldEl.val().length)):(this._state.lastGrouping=this.options.groupings,this._state.lastLength=this.getValue().length,this.setGroupings(this.optDefaults.groupings),this.el.addClass("selecting-all"),fieldEl=this.el.find("input"),fieldEl[0].setSelectionRange(0,fieldEl.val().length),this._state.selectingAll=!0)},SegmentedCardNumberInputView.prototype._endSelectAll=function(){return this.el.hasClass("selecting-all")?(this._state.selectingAll=!1,this._state.lastLength===this.getValue().length&&this.setGroupings(this._state.lastGrouping),this.el.removeClass("selecting-all")):void 0},SegmentedCardNumberInputView.prototype._indexInValueAtFieldSelection=function(field){var groupingIndex,i,len,offset,_i,_len,_ref;for(groupingIndex=this.el.find("input").index(field),offset=0,_ref=this.options.groupings,i=_i=0,_len=_ref.length;_len>_i;i=++_i)len=_ref[i],groupingIndex>i&&(offset+=len);return offset+field[0].selectionEnd},SegmentedCardNumberInputView.prototype.setGroupings=function(groupings,dontFocus){var groupEl,groupLength,_caretPosition,_currentField,_i,_len,_value;for(_currentField=this._getFocusedField(),_value=this.getValue(),_caretPosition=0,_currentField.length>0&&(_caretPosition=this._indexInValueAtFieldSelection(_currentField)),this.el.empty(),_i=0,_len=groupings.length;_len>_i;_i++)groupLength=groupings[_i],groupEl=$("<input>").attr({type:"text",pattern:"[0-9]*",size:groupLength,maxlength:groupLength,"class":"group"+groupLength,placeholder:new Array(groupLength+1).join(this.options.placeholderChar)}),this.el.append(groupEl);return this.options.groupings=groupings,this.setValue(_value),_currentField=this._focusFieldForValue([_caretPosition,_caretPosition],dontFocus),null!=_currentField&&_currentField[0].selectionEnd===_currentField[0].maxLength?this._focusField(_currentField.next(),"start"):void 0},SegmentedCardNumberInputView.prototype._focusFieldForValue=function(place,dontFocus){var field,fieldOffset,fieldPosition,groupIndex,groupLength,value,_i,_lastStartPos,_len,_ref;if(value=this.getValue(),"start"===place)field=this.el.find("input").first(),dontFocus||this._focusField(field,place);else if("end"===place)field=this.el.find("input").last(),dontFocus||this._focusField(field,place);else{for(field=null,fieldOffset=null,_lastStartPos=0,_ref=this.options.groupings,groupIndex=_i=0,_len=_ref.length;_len>_i;groupIndex=++_i)groupLength=_ref[groupIndex],place[1]>_lastStartPos&&place[1]<=_lastStartPos+groupLength&&(field=$(this.el.find("input")[groupIndex]),fieldPosition=place[1]-_lastStartPos),_lastStartPos+=groupLength;null!=field&&null!=fieldPosition?dontFocus||this._focusField(field,[fieldPosition,fieldPosition]):dontFocus||this._focusField(this.el.find("input"),"end")}return field},SegmentedCardNumberInputView.prototype._focusField=function(field,place){var fieldLen;return 0!==field.length&&(field[0].focus(),$(field[0]).is(":visible")&&field[0]===document.activeElement)?"start"===place?field[0].setSelectionRange(0,0):"end"===place?(fieldLen=field[0].maxLength,field[0].setSelectionRange(fieldLen,fieldLen)):field[0].setSelectionRange(place[0],place[1]):void 0},SegmentedCardNumberInputView.prototype.setValue=function(newValue){var el,groupIndex,groupLength,groupVal,_i,_lastStartPos,_len,_ref,_results;for(_lastStartPos=0,_ref=this.options.groupings,_results=[],groupIndex=_i=0,_len=_ref.length;_len>_i;groupIndex=++_i)groupLength=_ref[groupIndex],el=$(this.el.find("input").get(groupIndex)),groupVal=newValue.substr(_lastStartPos,groupLength),el.val(groupVal),_results.push(_lastStartPos+=groupLength);return _results},SegmentedCardNumberInputView.prototype.getValue=function(){var buffer,el,_i,_len,_ref;for(buffer="",_ref=this.el.find("input"),_i=0,_len=_ref.length;_len>_i;_i++)el=_ref[_i],buffer+=$(el).val();return buffer},SegmentedCardNumberInputView.prototype.maxLength=function(){return this.options.groupings.reduce(function(a,b){return a+b})},SegmentedCardNumberInputView.prototype.bind=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el).bind.apply(_ref,args)},SegmentedCardNumberInputView.prototype.trigger=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el).trigger.apply(_ref,args)},SegmentedCardNumberInputView.prototype.show=function(){return this.el.show()},SegmentedCardNumberInputView.prototype.hide=function(){return this.el.hide()},SegmentedCardNumberInputView.prototype.addClass=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el).addClass.apply(_ref,args)},SegmentedCardNumberInputView.prototype.removeClass=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el).removeClass.apply(_ref,args)},SegmentedCardNumberInputView}(),Skeuocard.prototype.ExpirationInputView=function(){function ExpirationInputView(opts){var _this=this;null==opts&&(opts={}),opts.pattern||(opts.pattern="MM/YY"),this.options=opts,this.date=null,this.el=$("<fieldset>"),this.el.addClass("cc-field"),this.el.delegate("input","keydown",function(e){return _this._onKeyDown(e)}),this.el.delegate("input","keyup",function(e){return _this._onKeyUp(e)}),this.el.delegate("input","focus",function(){return _this.el.addClass("focus")}),this.el.delegate("input","blur",function(){return _this.el.removeClass("focus")})}return ExpirationInputView.prototype.bind=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el).bind.apply(_ref,args)},ExpirationInputView.prototype.trigger=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el).trigger.apply(_ref,args)},ExpirationInputView.prototype._getFieldCaretPosition=function(el){var input,sel,selLength;return input=el.get(0),null!=input.selectionEnd?input.selectionEnd:document.selection?(input.focus(),sel=document.selection.createRange(),selLength=document.selection.createRange().text.length,sel.moveStart("character",-input.value.length),selLength):void 0},ExpirationInputView.prototype._setFieldCaretPosition=function(el,pos){var input,range;return input=el.get(0),null!=input.createTextRange?(range=input.createTextRange(),range.move("character",pos),range.select()):null!=input.selectionStart?(input.focus(),input.setSelectionRange(pos,pos)):void 0},ExpirationInputView.prototype.setPattern=function(pattern){var char,groupings,i,patternParts,_currentLength,_i,_len;for(groupings=[],patternParts=pattern.split(""),_currentLength=0,i=_i=0,_len=patternParts.length;_len>_i;i=++_i)char=patternParts[i],_currentLength++,patternParts[i+1]!==char&&(groupings.push([_currentLength,char]),_currentLength=0);return this.options.groupings=groupings,this._setGroupings(this.options.groupings)},ExpirationInputView.prototype._setGroupings=function(groupings){var fieldChars,group,groupChar,groupLength,input,sep,_i,_len,_startLength;for(fieldChars=["D","M","Y"],this.el.empty(),_startLength=0,_i=0,_len=groupings.length;_len>_i;_i++)group=groupings[_i],groupLength=group[0],groupChar=group[1],__indexOf.call(fieldChars,groupChar)>=0?(input=$("<input>").attr({type:"text",pattern:"[0-9]*",placeholder:new Array(groupLength+1).join(groupChar),maxlength:groupLength,"class":"cc-exp-field-"+groupChar.toLowerCase()+" group"+groupLength}),input.data("fieldtype",groupChar),this.el.append(input)):(sep=$("<span>").attr({"class":"separator"}),sep.html(new Array(groupLength+1).join(groupChar)),this.el.append(sep));return this.groupEls=this.el.find("input"),null!=this.date?this._updateFieldValues():void 0},ExpirationInputView.prototype._zeroPadNumber=function(num,places){var zero;return zero=places-num.toString().length+1,Array(zero).join("0")+num},ExpirationInputView.prototype._updateFieldValues=function(){var currentDate,_this=this;return currentDate=this.date,this.groupEls?this.groupEls.each(function(i,_el){var el,groupLength,year;switch(el=$(_el),groupLength=parseInt(el.attr("maxlength")),el.data("fieldtype")){case"M":return el.val(_this._zeroPadNumber(currentDate.getMonth()+1,groupLength));case"D":return el.val(_this._zeroPadNumber(currentDate.getDate(),groupLength));case"Y":return year=groupLength>=4?currentDate.getFullYear():currentDate.getFullYear().toString().substr(2,4),el.val(year)}}):this.setPattern(this.options.pattern)},ExpirationInputView.prototype.clear=function(){return this.value="",this.date=null,this.groupEls.each(function(){return $(this).val("")})},ExpirationInputView.prototype.setValue=function(newDate){return this.date=newDate,this._updateFieldValues()},ExpirationInputView.prototype.getValue=function(){return this.date},ExpirationInputView.prototype.reconfigure=function(opts){return null!=opts.pattern&&this.setPattern(opts.pattern),null!=opts.value?this.setValue(opts.value):void 0},ExpirationInputView.prototype._onKeyDown=function(e){var groupCaretPos,groupEl,groupMaxLength,nextInputEl,prevInputEl,_ref;if(e.stopPropagation(),groupEl=$(e.currentTarget),groupEl=$(e.currentTarget),groupMaxLength=parseInt(groupEl.attr("maxlength")),groupCaretPos=this._getFieldCaretPosition(groupEl),prevInputEl=groupEl.prevAll("input").first(),nextInputEl=groupEl.nextAll("input").first(),8!==e.which||0!==groupCaretPos||$.isEmptyObject(prevInputEl)||prevInputEl.focus(),37===(_ref=e.which)||38===_ref||39===_ref||40===_ref)switch(e.which){case 37:if(0===groupCaretPos&&!$.isEmptyObject(prevInputEl))return prevInputEl.focus();break;case 39:if(groupCaretPos===groupMaxLength&&!$.isEmptyObject(nextInputEl))return nextInputEl.focus();break;case 38:if(!$.isEmptyObject(groupEl.prev("input")))return prevInputEl.focus();break;case 40:if(!$.isEmptyObject(groupEl.next("input")))return nextInputEl.focus()}},ExpirationInputView.prototype.getRawValue=function(fieldType){return parseInt(this.el.find(".cc-exp-field-"+fieldType).val())
},ExpirationInputView.prototype._onKeyUp=function(e){var arrowKeys,dateObj,day,groupCaretPos,groupEl,groupMaxLength,groupValLength,month,nextInputEl,pattern,specialKeys,year,_ref,_ref1;return e.stopPropagation(),specialKeys=[8,9,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,46,91,93,144,145,224],arrowKeys=[37,38,39,40],groupEl=$(e.currentTarget),groupMaxLength=parseInt(groupEl.attr("maxlength")),groupCaretPos=this._getFieldCaretPosition(groupEl),_ref=e.which,__indexOf.call(specialKeys,_ref)<0&&(groupValLength=groupEl.val().length,pattern=new RegExp("[^0-9]+","g"),groupEl.val(groupEl.val().replace(pattern,"")),groupEl.val().length<groupValLength?this._setFieldCaretPosition(groupEl,groupCaretPos-1):this._setFieldCaretPosition(groupEl,groupCaretPos)),nextInputEl=groupEl.nextAll("input").first(),_ref1=e.which,__indexOf.call(specialKeys,_ref1)<0&&groupEl.val().length===groupMaxLength&&!$.isEmptyObject(nextInputEl)&&this._getFieldCaretPosition(groupEl)===groupMaxLength&&nextInputEl.focus(),day=this.getRawValue("d")||1,month=this.getRawValue("m"),year=this.getRawValue("y"),0===month||0===year?this.date=null:(2e3>year&&(year+=2e3),dateObj=new Date(year,month-1,day),this.date=dateObj),this.trigger("keyup",[this]),!1},ExpirationInputView.prototype._inputGroupEls=function(){return this.el.find("input")},ExpirationInputView.prototype.show=function(){return this.el.show()},ExpirationInputView.prototype.hide=function(){return this.el.hide()},ExpirationInputView}(),Skeuocard.prototype.TextInputView=function(){function TextInputView(opts){var _this=this;this.el=$("<div>"),this.inputEl=$("<input>").attr({type:"text",placeholder:opts.placeholder,"class":opts["class"]}),this.el.append(this.inputEl),this.el.addClass("cc-field"),this.options=opts,this.el.delegate("input","focus",function(){return _this.el.addClass("focus")}),this.el.delegate("input","blur",function(){return _this.el.removeClass("focus")}),this.el.delegate("input","keyup",function(e){return e.stopPropagation(),_this.trigger("keyup",[_this])})}return TextInputView.prototype.clear=function(){return this.inputEl.val("")},TextInputView.prototype.attr=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.inputEl).attr.apply(_ref,args)},TextInputView.prototype.setValue=function(newValue){return this.inputEl.val(newValue)},TextInputView.prototype.getValue=function(){return this.inputEl.val()},TextInputView.prototype.bind=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el).bind.apply(_ref,args)},TextInputView.prototype.trigger=function(){var args,_ref;return args=1<=arguments.length?__slice.call(arguments,0):[],(_ref=this.el).trigger.apply(_ref,args)},TextInputView.prototype.show=function(){return this.el.show()},TextInputView.prototype.hide=function(){return this.el.hide()},TextInputView}(),Skeuocard.prototype.CardProduct=function(){function CardProduct(attrs){this.attrs=$.extend({},attrs),this.pattern=this.attrs.pattern,this._variances=[],this.name={isFilled:this._isCardNameFilled.bind(this),isValid:this._isCardNameValid.bind(this)},this.number={isFilled:this._isCardNumberFilled.bind(this),isValid:this._isCardNumberValid.bind(this)},this.exp={isFilled:this._isCardExpirationFilled.bind(this),isValid:this._isCardExpirationValid.bind(this)},this.cvc={isFilled:this._isCardCVCFilled.bind(this),isValid:this._isCardCVCValid.bind(this)}}return CardProduct._registry=[],CardProduct.create=function(opts){return this._registry.push(new Skeuocard.prototype.CardProduct(opts))},CardProduct.firstMatchingShortname=function(shortname){var card,_i,_len,_ref;for(_ref=this._registry,_i=0,_len=_ref.length;_len>_i;_i++)if(card=_ref[_i],card.attrs.companyShortname===shortname)return card;return null},CardProduct.firstMatchingNumber=function(number){var card,combinedOptions,variation,_i,_len,_ref;for(_ref=this._registry,_i=0,_len=_ref.length;_len>_i;_i++)if(card=_ref[_i],card.pattern.test(number))return(variation=card.firstVariationMatchingNumber(number))?(combinedOptions=$.extend({},card.attrs,variation),new Skeuocard.prototype.CardProduct(combinedOptions)):new Skeuocard.prototype.CardProduct(card.attrs);return null},CardProduct.prototype.createVariation=function(attrs){return this._variances.push(attrs)},CardProduct.prototype.firstVariationMatchingNumber=function(number){var variance,_i,_len,_ref;for(_ref=this._variances,_i=0,_len=_ref.length;_len>_i;_i++)if(variance=_ref[_i],variance.pattern.test(number))return variance;return null},CardProduct.prototype.fieldsForLayoutFace=function(faceName){var face,fieldName,_ref,_results;_ref=this.attrs.layout,_results=[];for(fieldName in _ref)face=_ref[fieldName],face===faceName&&_results.push(fieldName);return _results},CardProduct.prototype._id=function(){var ident;return ident=this.attrs.companyShortname,null!=this.attrs.issuerShortname&&(ident+=this.attrs.issuerShortname),ident},CardProduct.prototype.eql=function(otherCardProduct){return(null!=otherCardProduct?otherCardProduct._id():void 0)===this._id()},CardProduct.prototype._daysInMonth=function(m,y){switch(m){case 1:return y%4===0&&y%100||y%400===0?29:28;case 3:case 5:case 8:case 10:return 30;default:return 31}},CardProduct.prototype._isCardNumberFilled=function(number){var _ref;return null!=this.attrs.cardNumberLength?(_ref=number.length,__indexOf.call(this.attrs.cardNumberLength,_ref)>=0):void 0},CardProduct.prototype._isCardExpirationFilled=function(exp){var currentDate,day,month,year;return currentDate=Skeuocard.currentDate,null==exp||null==exp.getMonth||null==exp.getFullYear?!1:(day=exp.getDate(),month=exp.getMonth(),year=exp.getFullYear(),day>0&&day<=this._daysInMonth(month,year)&&month>=0&&11>=month&&year>=1900&&year<=currentDate.getFullYear()+10)},CardProduct.prototype._isCardCVCFilled=function(cvc){return cvc.length===this.attrs.cvcLength},CardProduct.prototype._isCardNameFilled=function(name){return name.length>0},CardProduct.prototype._isCardNumberValid=function(number){return/^\d+$/.test(number)&&(this.attrs.validateLuhn===!1||this._isValidLuhn(number))&&this._isCardNumberFilled(number)},CardProduct.prototype._isCardExpirationValid=function(exp){var currentDate,day,isDateInFuture,month,year;return null==exp||null==exp.getMonth||null==exp.getFullYear?!1:(currentDate=Skeuocard.currentDate,day=exp.getDate(),month=exp.getMonth(),year=exp.getFullYear(),isDateInFuture=year===currentDate.getFullYear()&&month>=currentDate.getMonth()||year>currentDate.getFullYear(),isDateInFuture&&this._isCardExpirationFilled(exp))},CardProduct.prototype._isCardCVCValid=function(cvc){return this._isCardCVCFilled(cvc)},CardProduct.prototype._isCardNameValid=function(name){return this._isCardNameFilled(name)},CardProduct.prototype._isValidLuhn=function(number){var alt,i,num,sum,_i,_ref;for(sum=0,alt=!1,i=_i=_ref=number.length-1;_i>=0;i=_i+=-1){if(num=parseInt(number.charAt(i),10),isNaN(num))return!1;alt&&(num*=2,num>9&&(num=num%10+1)),alt=!alt,sum+=num}return sum%10===0},CardProduct}(),Skeuocard.prototype.CardProduct.create({pattern:/^(36|38|30[0-5])/,companyName:"Diners Club",companyShortname:"dinersclubintl",cardNumberGrouping:[4,6,4],cardNumberLength:[14],expirationFormat:"MM/YY",cvcLength:3,validateLuhn:!0,layout:{number:"front",exp:"front",name:"front",cvc:"back"}}),Skeuocard.prototype.CardProduct.create({pattern:/^35/,companyName:"JCB",companyShortname:"jcb",cardNumberGrouping:[4,4,4,4],cardNumberLength:[16],expirationFormat:"MM/'YY",cvcLength:3,validateLuhn:!0,layout:{number:"front",exp:"front",name:"front",cvc:"back"}}),Skeuocard.prototype.CardProduct.create({pattern:/^3[47]/,companyName:"American Express",companyShortname:"amex",cardNumberGrouping:[4,6,5],cardNumberLength:[15],expirationFormat:"MM/YY",cvcLength:4,validateLuhn:!0,layout:{number:"front",exp:"front",name:"front",cvc:"front"}}),Skeuocard.prototype.CardProduct.create({pattern:/^(6706|6771|6709)/,companyName:"Laser Card Services Ltd.",companyShortname:"laser",cardNumberGrouping:[4,4,4,4],cardNumberLength:[16,17,18,19],expirationFormat:"MM/YY",validateLuhn:!0,cvcLength:3,layout:{number:"front",exp:"front",name:"front",cvc:"back"}}),Skeuocard.prototype.CardProduct.create({pattern:/^4/,companyName:"Visa",companyShortname:"visa",cardNumberGrouping:[4,4,4,4],cardNumberLength:[13,14,15,16],expirationFormat:"MM/YY",validateLuhn:!0,cvcLength:3,layout:{number:"front",exp:"front",name:"front",cvc:"back"}}),Skeuocard.prototype.CardProduct.create({pattern:/^(62|88)/,companyName:"China UnionPay",companyShortname:"unionpay",cardNumberGrouping:[19],cardNumberLength:[16,17,18,19],expirationFormat:"MM/YY",validateLuhn:!1,cvcLength:3,layout:{number:"front",exp:"front",name:"front",cvc:"back"}}),Skeuocard.prototype.CardProduct.create({pattern:/^5[1-5]/,companyName:"Mastercard",companyShortname:"mastercard",cardNumberGrouping:[4,4,4,4],cardNumberLength:[16],expirationFormat:"MM/YY",validateLuhn:!0,cvcLength:3,layout:{number:"front",exp:"front",name:"front",cvc:"back"}}),Skeuocard.prototype.CardProduct.create({pattern:/^(5018|5020|5038|6304|6759|676[1-3])/,companyName:"Maestro (MasterCard)",companyShortname:"maestro",cardNumberGrouping:[4,4,4,4],cardNumberLength:[12,13,14,15,16,17,18,19],expirationFormat:"MM/YY",validateLuhn:!0,cvcLength:3,layout:{number:"front",exp:"front",name:"front",cvc:"back"}}),Skeuocard.prototype.CardProduct.create({pattern:/^(6011|65|64[4-9]|622)/,companyName:"Discover",companyShortname:"discover",cardNumberGrouping:[4,4,4,4],cardNumberLength:[16],expirationFormat:"MM/YY",validateLuhn:!0,cvcLength:3,layout:{number:"front",exp:"front",name:"front",cvc:"back"}}),visaProduct=Skeuocard.prototype.CardProduct.firstMatchingShortname("visa"),visaProduct.createVariation({pattern:/^414720/,issuingAuthority:"Chase",issuerName:"Chase Sapphire Card",issuerShortname:"chase-sapphire",layout:{name:"front",number:"front",exp:"front",cvc:"front"}})}).call(this);