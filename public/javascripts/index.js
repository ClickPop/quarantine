function updateSearchFormData() {
  $('#activity-search-form').find('select,input,textarea').each(function() {
    var $this = $(this);
    var id = $this.attr('id');
    var value = $this.val();
    var label = false;

    if (id === 'search-type') {
      label = $this.find(`option[value=${value}]`).text();
      dataLayer.push({'activity-search-type' : label});
    }
    if (id === 'search-audience') {
      label = $this.find(`option[value=${value}]`).text();
      dataLayer.push({'activity-search-audience' : label});
    }
    if (id === 'search-free') {
      label = ($this.is(':checked')) ? true : false;
      dataLayer.push({'activity-search-free' : label});
    }
  });
}

function handleSearchResponse(response, error) {
  var activity = false;
  $('#result > div').remove();
  if (typeof response === 'object') {
    if (response.hasOwnProperty('title')) {
      activity = response;
    } else if (
      response.hasOwnProperty('data') &&
      typeof response.data === 'object' &&
      response.data.hasOwnProperty('title')
    ) {
      activity = response.data;
    }
  } else {
    return false;
  }
  var contributors = activity.contributors;
  var contributorPeople = [];

  if (Array.isArray(contributors)) {
    contributors.forEach(function(contributor) {
      contributorPeople.push(`
      <li class="d-flex align-items-center">
        ${
          contributor.headshot !== undefined
            ? `<img src=${contributor.headshot[0].url} class="img-thumbnail rounded-circle mr-2" width="60">`
            : ''
        }
        <p class="m-0">${contributor.name}</p>
      </li>`);
    });
  }
  contributorPeople.join('');

  var contributorInfo = `
    <div class="mt-5 mb-2">
      This great idea came from...
      <ul class="p-0 d-flex">${contributorPeople}</ul>
    </div>
  `;

  var result = `
    <div class="col-12 col-md-10 offset-md-1">
      <div class="result__container py-3 py-sm-4 mt-sm-2">
        <h1>${activity.title}</h1>
        <p>${activity.description}</p>
        ${
          activity.url !== undefined
            ? `<a href=${activity.url} id="learn-more" target="_blank" class="btn btn-dark btn-sm mt-1">Learn more</a>`
            : ''
        }
        ${activity.contributors !== undefined ? contributorInfo : ''}
      </div>
    </div>`;

  var noActivity = `
    <div class="alert alert-warning text-center" role="alert">
      <p class="my-0"><strong>Sorry!</strong> There were no results for that query. Here's a random one!</p>
    </div>`;

  var $result = $(result)
    .appendTo('#result')
    .css('opacity', 0)
    .animate({
      opacity: 1
    });
  
  if (
    error !== undefined &&
    error.status === 404 &&
    error.responseJSON.data === 'No activity found'
  ) {
    var $noActivity = $(noActivity)
      .prependTo($result.find('.result__container').eq(0))
      .css('opacity', 0)
      .animate({
        opacity: 1
      });
  }

  $('#logo').slideUp('fast');
  $('#miniLogo').slideDown('fast');
  $('#result').slideDown('fast');
  $('.fullscreen__container').removeClass('pb-5');
  $('#go').attr('value', 'New idea.');
  $('.form__container').addClass('bg--lavender');

  history.pushState(
    {
      id: 'searchResult'
    },
    'Result',
    `/activities/${activity.id}`
  );

  var pastResults = JSON.parse(localStorage.getItem('pastResults'));

  if (pastResults === null) {
    pastResults = [];
  }

  if (pastResults.length < 50) {
    pastResults.push(activity);
  } else if (pastResults.length >= 50) {
    pastResults.shift();
    pastResults.push(activity);
  }

  localStorage.setItem('pastResults', JSON.stringify(pastResults));
}

$(document).ready(function() {
  $.ajaxSetup({ cache: false });
  
  $('#activity-search-form').on('submit', function(e) {
    e.preventDefault();
    var type = $('#search-type option:selected').attr('value');
    var audience = $('#search-audience option:selected').attr('value');
    var free = $('#search-free').is(':checked');
    var pastResults = JSON.parse(localStorage.getItem('pastResults'));
    if (pastResults !== null && pastResults.length >= 3) {
      pastResults = JSON.stringify(pastResults.slice(pastResults.length - 3));
    }

    updateSearchFormData();

    $.ajax({
      type: 'post',
      url: '/activities',
      data: {
        type,
        audience,
        free,
        pastResults
      },
      dataType: 'json',
      success: handleSearchResponse,
      error: function(xhr, status) {
        if (
          xhr.status === 404 &&
          xhr.responseJSON.data === 'No activity found'
        ) {
          $.ajax({
            type: 'post',
            url: '/activities',
            data: { free, pastResults },
            dataType: 'json',
            success: function(response) {
              handleSearchResponse(response, xhr);
            }
          });
        }
      }
    });
  })
  .find('select,input,textarea')
  .on('change blur', function() {
    updateSearchFormData();
  })
  .trigger('blur');

  if (
    typeof sharedActivity === 'object' &&
    sharedActivity.hasOwnProperty('title')
  ) {
    handleSearchResponse(sharedActivity);
  }
});
