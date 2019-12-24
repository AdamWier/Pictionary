import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './style.css';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import PropTypes, { string } from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

function Answer({ namespaceSocket, answers, isDisabled, checkAnswer }) {

    let messagesEnd = useRef(null);

    const [state, setState] = useState({
        inputText: "",
        answers: answers ? answers : [],
        score: 0
    });

    // Event type is broken according to GitHub discussions. Set to any.
    const handleChange = (event: any): void => {
        let inputText = event.target.value;
        setState(state => ({
            ...state,
            inputText
        }));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const answer = state.inputText;
        if (answer) {
            try {
                namespaceSocket.emit('answer', answer)
                const answers = state.answers;
                answers.push(answer);
                const isCorrect = checkAnswer(answer);
                setState(state => ({
                    ...state,
                    answers,
                    inputText: "",
                    score: isCorrect ? state.score + 15 : state.score
                }));
            } catch (e) {
                console.log('There was a problem sending the message');
            }
        }
    }

    useEffect(() => {
        if (messagesEnd.current) {
            messagesEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [state.answers.length])

    return (
        <Row>
            <Col md={{ span: 12, order: 2 }}>
                {!isDisabled &&
                    <Form onSubmit={handleSubmit}>
                        <InputGroup className="my-4">
                            <FormControl
                                type="text"
                                placeholder="Ecrivez votre réponse"
                                aria-label="Ecrivez votre réponse"
                                onChange={handleChange}
                                value={state.inputText} />
                            <InputGroup.Append>
                                <Button type="submit">Envoyer</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                }
            </Col>
            <Col md={{ span: 12, order: 1 }}>
                <Card id="chat-window">
                    <Card.Header>
                        Réponses
                    </Card.Header>
                    <div id="message-window" >
                        {state.answers.length !== 0 && <ListGroup className="text-center my-2">
                            {
                                state.answers.map((answer: string, index: number) => <ListGroup.Item key={`answer-${index.toString()}`}>{answer}</ListGroup.Item>)
                            }
                            <div ref={messagesEnd} ></div>
                        </ListGroup>}
                    </div>
                </Card>
            <p className="my-2">Votre score : <Badge variant="warning">{state.score}</Badge></p>
            </Col>
        </Row>
    )
}

Answer.propTypes = {
    namespaceSocket: PropTypes.any.isRequired,
    answers: PropTypes.arrayOf(string).isRequired,
    isDisabled: PropTypes.bool.isRequired,
    checkAnswer: PropTypes.func.isRequired
}

export default Answer;