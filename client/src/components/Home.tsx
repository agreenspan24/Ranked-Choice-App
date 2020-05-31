import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PollDto } from '../types';
import axios from 'axios';

type HomeState = {
    polls: PollDto[];
}

export class Home extends Component<{}, HomeState>  {
    constructor(props: {}) {
        super(props);

        this.state = {
            polls: []
        };
    }
    
    componentDidMount() {
        axios.get<PollDto[]>('/api/polls')
            .then(res => {
                this.setState({
                    polls: res.data
                });
            }).catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <>
                <h1>Home page</h1>
                <Link to="/poll">Create Poll</Link>
                {this.state.polls.map(p => 
                    <div>
                        <Link to={`/poll?poll_id=${p.id}`}>{p.name}</Link>
                        <div>{p.description}</div>
                        <div>Votes: {p.voters.length}</div>
                    </div>
                )}
            </>
        );
    }
}