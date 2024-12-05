import { Container, ProgressBar, Button } from 'react-bootstrap';

import { useContext } from 'react';
import AppContext from '../../context/AppContext';

export function LoaderBar(props) {
    const { state } = useContext(AppContext);

    return (
        <Container>
            <ProgressBar animated now={props.status * 15} />
            {state.language.progressBarText(props.status)}
        </Container>
    );
}

export function LoaderButton(props) {

    const { state } = useContext(AppContext);

    return (
        <Button 
            className={props.disabled ? "uncomplete": "complete"}
            variant="outline-primary" 
            disabled={props.disabled} 
            onClick={props.onclick}>
            <span className={props.loadingStatus ? "spinner-grow spinner-grow-sm" : ""} role="status" aria-hidden="true"></span>
            {state.language.buttonText(props.loadingStatus)}
        </Button>
    );
}
