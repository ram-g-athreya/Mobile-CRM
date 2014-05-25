var mailgun = require('mailgun')
var mg = new mailgun.Mailgun('key-7n88ceijgdrsmqanzdh-egoi107dl501');
var sendMail = function(options){
  mg.sendText(
      (options.from) ? options.from:'noreply@mobile-crm.com',
      options.to,
      options.subject,
      options.text
  );
}

module.exports = {
  sendMail: sendMail
};
