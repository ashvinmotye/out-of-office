const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

document.addEventListener('DOMContentLoaded', () => {
  const greeting = 'Hello, thank you for your message.<br/><br/>';
  const urgentContactMsg = '<br/><br/>For urgent matters, please contact';
  const ending = '<br/><br/>Have a nice day. Thank you.';

  const messageTemplate = {
    multiple: `${greeting} Please note that I am on leave from [start] to [end]. I will get back to you on [return].`,
    single: `${greeting}Please note that I am on leave today, [start]. I will get back to you on [return].`,
    publicHoliday: `${greeting}Please note that I am on leave today, [start] (public holiday in Mauritius). I will get back to you on [return].`
  };

  const getNextWorkDay = date => {
    let day = date.getDay(), add = 1;
    if (day === 6) add = 2; else
      if (day === 5) add = 3;
    date.setDate(date.getDate() + add); // will correctly handle 31+1 > 32 > 1st next month
    return date;
  };


  const buttonEl = document.querySelector('#generate-message');
  const copyBtn = document.querySelector('#copy-message');
  const startDateEl = document.querySelector('#start-date');
  const endDateEl = document.querySelector('#end-date');
  const urgentContactEl = document.querySelector('#urgent-contact');
  const messageEl = document.querySelector('#message');

  buttonEl.addEventListener('click', () => {
    const isPublicHoliday = document.querySelector('#public-holiday').checked;

    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };

    let startDate = new Date(startDateEl.value).toLocaleDateString('en', options);
    let endDate = new Date(endDateEl.value).toLocaleDateString('en', options);
    let returnDate = getNextWorkDay(new Date(endDateEl.value)).toLocaleDateString('en', options);

    let message = messageTemplate.multiple;

    if (endDate == 'Invalid Date') {
      message = isPublicHoliday ? messageTemplate.publicHoliday : messageTemplate.single;
      message = message.replace('[return]', getNextWorkDay(new Date(startDateEl.value)).toLocaleDateString('en', options));
    }


    if (startDate != 'Invalid Date') {
      message = message.replace('[start]', startDate);
    }

    if (endDate != 'Invalid Date') {
      message = message.replace('[end]', endDate);
    }

    if (returnDate != 'Invalid Date') {
      message = message.replace('[return]', returnDate);
    }

    if(urgentContactEl.value.length) {
      message += ` ${urgentContactMsg} ${urgentContactEl.value}.`
    }

    message += ` ${ending}`;

    messageEl.innerHTML = message;
  });

  copyBtn.addEventListener('click', function(){
    let message = document.querySelector('#message').innerText;
    if(!message.length) {
      return;
    }
    copyToClipboard( message );
    copyBtn.innerText = 'Copied!';
    copyBtn.disabled = true;

    setTimeout(() => {
      copyBtn.innerText = 'Copy message';
      copyBtn.disabled = false;
    }, 3000);
  })
});