//= require jquery
//= require jquery_ujs
//= require jquery-ui/datepicker
//= require autocomplete-rails
//= require jquery-fileupload/basic
//= require jquery-fileupload/vendor/tmpl
//= require lines/admin/pictures
//= require lines/admin/autosize.min
//= require lines/admin/navbar

// Function to insert uploaded pictures into the content at cursor position
jQuery.fn.extend({
  insertAtCaret: function(myValue){
    return this.each(function(i) {
      if (document.selection) {
        //For browsers like Internet Explorer
        this.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      }
      else if (this.selectionStart || this.selectionStart == '0') {
        //For browsers like Firefox and Webkit based
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      } else {
        this.value += myValue;
        this.focus();
      }
    });
  }
});

hero_image = {
  init: function() {
    this.bind_events();
    this.check_availability();
  },

  bind_events: function() {
    $(document).on('click', '.btn-change-hero', function(e) {
      e.preventDefault();
      $('.upload-overlay').fadeIn('fast');
    });
    $(document).on('click', '.hero-background-overlay', function(e) {
      e.preventDefault();
      $('.upload-overlay').fadeOut('fast');
    });
    $(document).on('click', '.hero-images img', function(e) {
      e.preventDefault();
      hero_image.preview_default($(this));
    });
    $(document).on('click', '.btn-remove-hero', function(e) {
      e.preventDefault();
      hero_image.remove_hero();
    });
    document.getElementById('article_hero_image').addEventListener('change', this.preview, false);
  },

  check_availability: function() {
    if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
      console.log('The File APIs are not fully supported in this browser.');
    }
  },

  remove_hero: function() {
    $('#article_short_hero_image, #article_hero_image_file, #article_hero_image').val('');
    $('.hero-upload > img').remove();
    $('.upload-overlay').fadeOut('fast');
    $('.btn-remove-hero').removeClass('show')
  },

  preview_default: function(img) {
    $('#article_hero_image_file').val('');
    $('#article_short_hero_image').val(img.attr('src'));
    if ($('.hero-upload > img').length) {
      $('.hero-upload > img').attr('src', img.attr('src'));
    } else {
      $('.hero-upload').append('<img src="' + img.attr('src') + '" alt="" />');
    }
    $('.btn-remove-hero').addClass('show');
    $('.upload-overlay').fadeOut('fast');
  },

  preview: function(e) {
    var files = e.target.files;
    if (files.length > 0) {
      var f = files[0];
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          $('#article_short_hero_image').val('');
          if ($('.hero-upload > img').length) {
            $('.hero-upload > img').attr('src', e.target.result);
          } else {
            $('.hero-upload').append('<img src="' + e.target.result + '" alt="" />');
          }
          $('.btn-remove-hero').addClass('show');
          $('.upload-overlay').fadeOut('fast');
        };
      })(f);
      reader.readAsDataURL(f);
    }
  }
};

$(document).ready(function() {
  // New stuff lines 1.0
  // Handle hero image uploads
  hero_image.init();

  // Handle password input placeholders
  $.each($("input[type='password']"), function(key, val) {
    val.placeholder = "Password";
  });

  // Handle Codemirror
  $.each($("[data-editor='codemirror']"), function(key, val) {
    CodeMirror.fromTextArea(val, {
      mode: {
        name: 'gfm',
        highlightFormatting: true
      },
      lineWrapping: true,
      tabSize: 2,
      theme: 'lines',
      viewportMargin: Infinity
    });
  });

  // ---------------------------------------------------------

  // Deactivate OnBeforeUnload on submit button
  // You can add even more buttons, just add the class or id of the button/link
  // All buttons/links which are listed below will not produce a "Warning"-Alert on leaving the page when something has changed but not saved
  $('.btn-save-publish').click(function() {
    window.onbeforeunload = null;
  });

  // Autogrow and -shrink the content text box while typing
  // This allows the user to see the whole text copy all the time
  $('textarea').autosize();

  // Close error notification
  $('#error_explanation, .close').on('click', function(e){
    $('#error_explanation').slideUp();
  });
  
  // Insert image into content of the post
  $(document.body).on('click', ".insert-image",  function(e){
    var url = $(this).attr( 'data-url' );
    var value = '\n![Alt text](' + url + ')\n';
    $('#article_content').insertAtCaret(value);
    e.preventDefault();
  });

  // Show datepicker
  $(document).on("focus", "[data-behaviour~='datepicker']", function(e){
    var altFormat = $(this).datepicker( "option", "altFormat" );
    $(this).datepicker({dateFormat: "yy-mm-dd"});
  });

  // Scroll to the top of the page
  $('.top_link').click(function(){
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
  });

  // Close notification boxes below the navbar
  $('.alert').click(function(e){
    e.preventDefault();
    $(this).slideUp();
  });

  // Formatting Help functions
  $('.btn-close-formatting').click(function() {
    $('#formatting_guide').fadeOut();
  });
  $('.btn-close-formatting-small').click(function() {
    $('#formatting_guide').fadeOut();
  });
  $('.btn-formatting-help').click(function() {
    $('#formatting_guide').fadeIn();
  });
  
  // Show security alert on unload only when something has changed
  $('.edit_article input, .edit_article textarea, .new_article input, .new_article textarea').bind("keyup change", function() {
    window.onbeforeunload = function() {
      return 'You have NOT saved your article. Stop and save if you want to keep your changes.';
    };
  });

});