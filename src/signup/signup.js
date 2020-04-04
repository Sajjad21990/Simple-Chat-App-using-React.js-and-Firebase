import { Link } from "react-router-dom";
import React from "react";
import styles from "./styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const firebase = require("firebase");

class SignupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      passwordConfirmation: null,
      signupError: ""
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign Up !
          </Typography>
          <form className={classes.form} onSubmit={e => this.submitSignup(e)}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-email-input">
                Enter Your Email
              </InputLabel>
              <Input
                autoComplete="email"
                autoFocus
                id="signup-email-input"
                onChange={e => this.userTyping("email", e)}
              ></Input>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel htmlFor="signup-password-input">
                Enter Your Password
              </InputLabel>
              <Input
                type="password"
                id="signup-password-input"
                onChange={e => this.userTyping("password", e)}
              ></Input>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel htmlFor="signup-password-confirmation--input">
                Confirm Your Password
              </InputLabel>
              <Input
                type="password"
                id="signup-password-confirmation--input"
                onChange={e => this.userTyping("passwordConfirmation", e)}
              ></Input>
            </FormControl>
            <Button
              type="sumit"
              fullWidth
              variant="contained"
              className={classes.submit}
              color="primary"
            >
              Sign Up
            </Button>
            {this.state.signupError ? (
              <Typography
                component="h5"
                variant="h6"
                className={classes.errorText}
              >
                {this.state.signupError}
              </Typography>
            ) : null}
            <Typography
              component="h5"
              variant="h6"
              className={classes.hasAccountHeader}
            >
              Already Have An Account !
            </Typography>
            <Link className={classes.logInLink} to="/login">
              Log in
            </Link>
          </form>
        </Paper>
      </main>
    );
  }

  userTyping = (type, e) => {
    switch (type) {
      case "email":
        this.setState({ email: e.target.value });
        break;

      case "password":
        this.setState({ password: e.target.value });
        break;

      case "passwordConfirmation":
        this.setState({ passwordConfirmation: e.target.value });
        break;

      default:
        break;
    }
  };

  formIsValid = () => this.state.password === this.state.passwordConfirmation;

  submitSignup = e => {
    e.preventDefault();
    if (!this.formIsValid()) {
      this.setState({ signupError: "Passwords Do Not Match !!" });
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        authRes => {
          const userObj = {
            email: authRes.user.email
          };
          firebase
            .firestore()
            .collection("users")
            .doc(this.state.email)
            .set(userObj)
            .then(
              () => {
                this.props.history.push("/dashboard");
              },
              dbError => {
                console.log(dbError);

                this.setState({
                  signupError: "Unable To Add User !!" + dbError
                });
              }
            );
        },
        authError => {
          console.log(authError);
          this.setState({ signupError: "Unable To Add User !!" });
        }
      );
  };
}

export default withStyles(styles)(SignupComponent);
