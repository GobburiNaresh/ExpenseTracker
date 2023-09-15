const sendinblue = require('sib-api-v3-sdk');
const { TransactionalEmailsApi } = sendinblue;
const uuid = require('uuid');
const Forgotpassword = require("../models/resetpassword");
const User = require("../models/signup");
const SendinblueAPIKey = 'V3.xsmtpsib-a3b229e809825338d442fb509e8268c4103afcf10b3cc72a428e4bd7732342c1-TYIEfqpWJPsBjCUQ';
const sendinblueClient = new TransactionalEmailsApi();

const forgotpassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ where: {email: email} });
    console.log(user);
    console.log("========>===========================================>");
    sendinblue.ApiClient.instance.authentications['api-key'].apiKey = SendinblueAPIKey;
    if (user) {
      const id = uuid.v4();
      console.log('forgotid', id);
      Forgotpassword.create({ id, userDetailId: user.id, active: true })
        .catch(err => {
          console.log(err);
        });

      const msg = {
        to: [{ email: email }],
        templateId: 1, // Replace with your SendinBlue template ID
        params: { resetLink: `http://localhost:3000/password/resetpassword/${id}` }
      };

      sendinblueClient.sendTransacEmail(msg)
        .then((response) => {
          return res.status(200).json({ message: "Link to reset password", success: true });
        })
        .catch((err) => {
          console.log(err);
          return res.json({ message: "Failed to send email", success: false });
        });
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: err.message, success: false });
  }
};

const resetpassword = (req, res) => {
  const id = req.params.id;
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordRequest) => {
    if (forgotpasswordRequest) {
      forgotpasswordRequest.update({ active: false });
      res.status(200).send(`<html>
          <script>
              function formsubmitted(e){
                  e.preventDefault();
                  console.log('called')
              }
          </script>
          <form action="/password/updatepassword/${id}" method="get">
              <label for="newpassword">Enter New password</label>
              <input name="newpassword" type="password" required></input>
              <button>reset password</button>
          </form>
      </html>`);
      res.end();
    }
  });
};

module.exports = {
  forgotpassword,
  resetpassword
};
