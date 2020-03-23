function pastResultsFilter(activity) {
  return (typeof activity === 'string'
  && activity.length > 10
  && activity.length < 20
  && activity.indexOf('rec') === 0);
}
function getPastResults() {
  var pastResults = store.get('pastResults');

  if (Array.isArray(pastResults)) {
    pastResults = pastResults.filter(pastResultsFilter);

    while (pastResults.length > 50) {
      pastResults.shift();
    }
  } else {
    pastResults = [];
    store.remove('pastResults');
  }

  return pastResults;
}

function updatePastResults(pastResults, activity) {
  if (Array.isArray(pastResults)) {
    while (pastResults.length >= 50) {
      pastResults.shift();
    }
  } else {
    pastResults = [];
  }

  pastResults.push(activity.id);

  store.set('pastResults', pastResults);
  return pastResults;
}

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

  var contributorInfo = `
    <div class="mt-4">
      This great idea came from...
      <ul class="p-0 d-flex">${contributorPeople.join('')}</ul>
    </div>
  `;

  var result = `
    <div class="col-12 col-md-10 offset-md-1">
      <div class="result__container py-3 py-sm-4 my-sm-4">
        <h1>${activity.title}</h1>
        <p>${activity.description} ${
          activity.url !== undefined
            ? `<small class="font-weight-bold"><a href=${activity.url} id="learn-more" target="_blank">Learn more...</a></small>`
            : ''
        }</p>
        ${activity.contributors !== undefined ? contributorInfo : ''}
        <div class="notice notice--warning pl-2 pr-3 py-2 mt-5 bg--slate">
          <div>
            ⚠️
          </div>
          <div>
            In-person activities are for people who share a house only. Please follow the <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/index.html" class="text--mustard">CDC guidelines</a> regarding social distancing. We have plenty of ideas for people in different locations to connect using the magic of the internet.
          </div>
        </div>
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

  pastResults = updatePastResults(pastResults, activity);

  history.pushState(
    {
      id: 'searchResult'
    },
    'Result',
    `/activities/${activity.id}`
  );
}

var pastResults = getPastResults();

$(document).ready(function() {
  $.ajaxSetup({ cache: false });

  $('#activity-search-form').on('submit', function(e) {
    e.preventDefault();
    var type = $('#search-type').val();
    var audience = $('#search-audience').val();
    var free = $('#search-free').is(':checked');
    var pastResultsTrimmed = pastResults;
    if (pastResultsTrimmed !== null && pastResultsTrimmed.length >= 5) {
      pastResultsTrimmed = pastResults.slice(pastResults.length - 5);
    }

    if (typeof dataLayer !== 'undefined')  updateSearchFormData();

    $.ajax({
      type: 'post',
      url: '/activities',
      data: {
        type,
        audience,
        free,
        pastResults: pastResultsTrimmed
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
    if (typeof dataLayer !== 'undefined') updateSearchFormData();
  })
  .trigger('blur');

  if (
    typeof sharedActivity === 'object' &&
    sharedActivity.hasOwnProperty('title')
  ) {
    handleSearchResponse(sharedActivity);
  }
});
