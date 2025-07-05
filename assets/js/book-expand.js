"use strict";
$(function() {
  $('.book').on('click', function () {
    const $book = $(this);
    if ($book.hasClass('book--expanded')) {
      $book.scrollTop(0);
      $book.removeClass('book--expanded');
    } else {
      $book.addClass('book--expanded');
    }
  });
}); 