const sendEmailService = require("./_sendEmailService");
const { URL } = require("./urls");

const signupMailService = async (req, res, userCreated, signupConfirmToken) => {
  try {
    const resetURL = `${URL}/api/confirmAccount/${signupConfirmToken}`;

    // const message = `basak's blog\nTeşekkür ederiz.? lütfen\n${resetURL}\nlinkini kopyalıp tarayıcınıza yapıstırın.`;

    // const messageHTML =
    //   "<br /><br /><h2>basak's blog</h2><h3>Teşekkür ederiz. Kayıt işleminizi tamamlayabilmemiz için \
    //   lütfen <br /><a href=\"" +
    //   resetURL +
    //   `\">${URL}/confirmAccount/${signupConfirmToken}</a> linkine tıklayın...</h3>`;

    const message = req.t("signup_email_text_message", {
      resetURL: resetURL,
    });

    const messageHTML = req.t("signup_email_html_message", {
      h2: "<h2>",
      h2End: "</h2>",
      h3: "<h3>",
      h3End: "</h3>",
      br: "<br />",
      a: `<a href="${resetURL}">${resetURL}</a>`,
    });

    await sendEmailService({
      email: userCreated.email,
      subject: req.t("registration_completion_email"),
      message: message,
      messageHTML: messageHTML,
    });

    return res.status(200).json({
      logged: false,
      message: req.t("pending"),
    });
  } catch (error) {
    console.log(error.message);
    userCreated.confirmationCode = undefined;
    userCreated.status = "Pending";
    return res
      .status(500)
      .send({ message: req.t("a_technical_problem_occurred") });
  }
};

module.exports = signupMailService;
