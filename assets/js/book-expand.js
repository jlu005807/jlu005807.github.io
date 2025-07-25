"use strict";
console.log('book-expand.js loaded');
$(function() {
  $('.book').on('click', function () {
    const $book = $(this);
    console.log('book-expand.js main logic executed');
    if ($book.hasClass('book--expanded')) {
      $book.scrollTop(0);
      $book.removeClass('book--expanded');
    } else {
      $book.addClass('book--expanded');
    }
  });
}); 