document.addEventListener('DOMContentLoaded', () => {
  const messageTemplate = {
    multiple: `Hello, thank you for your message. Please note that I am currently on leave from [start] to [end]. I will get back to you on [return]. Have a nice day. Thank you.`,
    single: `Hello, thank you for your message. Please note that I am currently on leave today, [start]. I will get back to you on [return]. Have a nice day. Thank you.`
  };

  const getNextWorkDay = date => {
    let day = date.getDay(), add = 1;
    if (day === 6) add = 2; else
      if (day === 5) add = 3;
    date.setDate(date.getDate() + add); // will correctly handle 31+1 > 32 > 1st next month
    return date;
  };


  const buttonEl = document.querySelector('#generate-message');
  const startDateEl = document.querySelector('#start-date');
  const endDateEl = document.querySelector('#end-date');
  const messageEl = document.querySelector('#message');

  buttonEl.addEventListener('click', () => {
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
      message = messageTemplate.single;
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

    messageEl.innerText = message;
  });
});