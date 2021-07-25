const sendEmailService = require("./_sendEmailService");
const { URL } = require("./urls");

const forgotPasswordMailService = async (req, res, user, resetToken) => {
  const resetURL = `${URL}/api/resetPassword/${resetToken}`;

  // const message = `şifrenizi mi unuttunuz? lütfen\n${resetURL}\nlinkini kopyalıp tarayıcınıza yapıstırın.\n\nGönderdiğimiz link 10 dakika sonra geçersiz olacaktır.\nEğer bu emaili hata sonucu aldıysanız veya şifrenizi hatırlarsanız\nbu emaili dikkate almayınız`;

  // const messageHTML =
  //   "<br /><br /><h2>basak's blog</h2><h3>şifrenizi mi unuttunuz? \
  //     lütfen <br /><a href=\"" +
  //   resetURL +
  //   `\">${resetURL}</a> linkine tıklayın...</h3><h3><br />Gönderdiğimiz link 10 dakika sonra geçersiz olacaktır.
  //     <br /> Eğer bu emaili hata sonucu aldıysanız veya şifrenizi hatırlarsanız <br /> bu emaili dikkate almayınız.</h3>`;

  const message = req.t("forgot_password_text_message", {
    resetURL: resetURL,
  });

  const messageHTML = req.t("forgot_password_html_message", {
    h2: "<h2>",
    h2End: "</h2>",
    h3: "<h3>",
    h3End: "</h3>",
    br: "<br />",
    a: `<a href="${resetURL}">${resetURL}</a>`,
    resetURL: resetURL,
  });

  try {
    await sendEmailService({
      email: user.email,
      subject: "şifre sıfırlama maili 10 dakika geçerlidir",
      message: message,
      messageHTML: messageHTML,
    });
    return res.status(200).json({
      message: "password reset token has been sent to your email address",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({
      message: "there was an error sending password reset token email",
    });
  }
};

module.exports = forgotPasswordMailService;
