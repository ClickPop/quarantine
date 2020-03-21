var searchFormData = {
  type: '',
  audience: '',
  free: false
};

function updateSearchFormDataLayer() {
  if (Array.isArray(dataLayer)) {
    var count = dataLayer.length;
    var updated = false;
    for (i = 0; i < count; i++) {
      if (
        typeof dataLayer[i] === 'object' &&
        dataLayer[i].hasOwnProperty('activity-search-form-data')
      ) {
        dataLayer[i] = searchFormData;
        updated = true;
      }
    }
    if (!updated) {
      dataLayer.push({ 'activity-search-form-data': searchFormData });
    }
  }
}

function updateSearchFormData() {
  $('#activity-search-form')
    .find('select,input,textarea')
    .each(function() {
      var $this = $(this);
      var value = $this.val();
      var id = $this.attr('id');

      if (id === 'search-type') {
        searchFormData.type = value;
      }
      if (id === 'search-audience') {
        searchFormData.audience = value;
      }
      if (id === 'search-free') {
        searchFormData.free = $this.is(':checked') ? true : false;
      }
    });
  updateSearchFormDataLayer();
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

  const noActivity = `
    <div class="col-12 col-md-10 offset-md-1">
        <div class="result__container py-3 py-sm-4 mt-sm-2">
        <h3>Sorry, there were no results for that query. Here's a random one!</h3>
        </div>
    </div>
    `;

  if (error.status === 404 && error.responseJSON.data === 'No activity found') {
    $(noActivity)
      .appendTo('#result')
      .css('opacity', 0)
      .animate({
        opacity: 1
      });
  }

  $(result)
    .appendTo('#result')
    .css('opacity', 0)
    .animate({
      opacity: 1
    });

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

  let pastResults = JSON.parse(localStorage.getItem('pastResults'));

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
  updateSearchFormData();

  $('#activity-search-form')
    .find('input,select')
    .on('change blur', function() {
      updateSearchFormData();
    });

  $('#activity-search-form').on('submit', function(e) {
    var type = $('#search-type option:selected').attr('value');
    var audience = $('#search-audience option:selected').attr('value');
    var free = $('#search-free').is(':checked');
    let pastResults = JSON.parse(localStorage.getItem('pastResults'));
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
  });

  if (
    typeof sharedActivity === 'object' &&
    sharedActivity.hasOwnProperty('title')
  ) {
    handleSearchResponse(sharedActivity);
  }
});
