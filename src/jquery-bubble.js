/*
 *
 *
 *
 * Copyright (c) 2016 Sokratis Vidros
 * Licensed under the MIT license.
 */
(function ($) {
  const DELAY = 200;
  const ARROW_OFFSET = 10;
  const POPOVER_OFFSET = 37;
  const POPOVER_ROOT_RATIO = 0.8;
  const CONTAINER_SELECTOR = '.container';

  function render(root, target) {
    const $root = $(root);
    const $target = $(target);
    const tip = $target.attr('title') || $target.attr('data-title') || $target.data('title');

    if (!tip) {
      return false;
    }

    const $popover = $(`
      <div class='jq-bubble' data-ui='sticky'>
        <div class='content'></div>
        <div class='arrow'></div>
      </div>
    `);

    $popover.css('opacity', 0)
      .find('.content')
      .html(tip)
      .end()
      .appendTo($root);

    function adjust() {
      $popover.css('max-width', Math.floor($root.outerWidth() * POPOVER_ROOT_RATIO));

      const rootOffset = $root.offset();
      const targetOffset = $target.offset();

      let posLeft = targetOffset.left + ($target.outerWidth() / 2) - ($popover.outerWidth() / 2);
      let posTop = targetOffset.top + $target.outerHeight() + ARROW_OFFSET;

      if (posLeft < rootOffset.left) {
        posLeft = targetOffset.left + $target.outerWidth() / 2 - POPOVER_OFFSET;
      }

      const newPosLeft = rootOffset.left + $root.outerWidth() - $popover.outerWidth() - ((1 - POPOVER_ROOT_RATIO) / 2) * $root.outerWidth() + POPOVER_OFFSET;

      posLeft = Math.min(posLeft, newPosLeft);

      if (posTop - $(window).scrollTop() + $popover.outerHeight() > $root.outerHeight()) {
        posTop = targetOffset.top - $popover.outerHeight() - ARROW_OFFSET;
        $popover.addClass('top');
      } else {
        $popover.removeClass('top');
      }

      $popover
        .css({
          top: Math.round(posTop - rootOffset.top),
          left: Math.round(posLeft - rootOffset.left)
        })
        .find('.arrow')
        .css('left', Math.round(targetOffset.left - posLeft + target.outerWidth() / 2))
        .end()
        .animate({ opacity: 1 }, 50);
    }

    function remove() {
      if ($popover.data('ui') === 'sticky') {
        return;
      }

      $popover.animate({ opacity: 0 }, 50, function () {
        $target.off('mouseleave');
        $(this)
          .off('mouseenter mouseleave')
          .remove();
      });
    }

    $popover.one('mouseenter', () => {
      $popover.data('ui', 'sticky');
    });

    $popover.one('mouseleave', () => {
      $popover.data('ui', '');
      remove();
    });

    $target.one('mouseleave', () => {
      $popover.data('ui', '');
      setTimeout(remove, 0);
    });

    adjust();
    $(window).resize(adjust);
  }

  $.fn.jqBubble = function () {
    $(this).on('mouseenter', '[rel~=popover]', e => {
      const $target = $(e.target).closest('[rel~=popover]');
      const timer = setTimeout(() => render(this, $target), DELAY);

      $target.one('mouseleave', () => clearTimeout(timer));
    });
  };
}(jQuery));
