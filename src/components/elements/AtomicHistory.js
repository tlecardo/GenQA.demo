import { Card, Container, Row } from 'react-bootstrap';
import ModalForm from "../ModalForm"
import VizDT from './VizDT';
import AppContext from '../../context/AppContext';
import { useContext } from 'react';
import Toaster from "../../assets/js/tools/toaster"

function AtomicHistory(props) {

    const { api } = useContext(AppContext);
    let rId = Math.floor(Math.random() * 100000) + 1;

    return (
        <Row style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <Card style={{ borderRadius: "1rem", border: "0.2rem solid #22577A", height: "50%" }}>
                <Container style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    <VizDT id={props.id} local={rId} />
                </Container>
                <Card.Body style={{ textAlign: 'center', marginTop: "-1.5rem" }}>
                    <Card.Title className='subtitle' >{props.title}</Card.Title>
                    <Container onMouseEnter={() => {
                        api.updateArticleText(props.article)
                        api.updateId(null, null, props.id)
                    }}>
                        <ModalForm
                            displayToast={text => Toaster.errorInputs(text)}
                            disabledStatusId={false}
                            disabledStatusArticle={false} />
                    </Container>
                </Card.Body>
            </Card>
        </Row>
    );
}

export default AtomicHistory;