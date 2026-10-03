import LoginForm from '../../../Components/LoginForm'

const Account = (props) => {
    const { dbReady } = props;
    return (
        <LoginForm dbReady={dbReady} btnTxt={'Update Profile'} />
    )
}

export default Account;