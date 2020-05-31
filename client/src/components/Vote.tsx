import React, { Component } from 'react';
import { PollDto } from '../types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getPoll } from '../api/poll';
import { getParam } from '../helpers';

type OptionRank = {
    rank: number;
    option: string | null;
}

type VoteState = {
    poll_id: string | null;
    poll: PollDto | null;
    voter: string;
    choices: OptionRank[];
}

export class Vote extends Component<{}, VoteState> {
    constructor(props: {}) {
        super (props);

        this.state = {
            poll_id: getParam('poll_id'),
            poll: null,
            voter: '',
            choices: []
        };
    }

    private getPoll = () => {
        if (!this.state.poll_id) return;

        getPoll(this.state.poll_id).then(res => {
            const choices: OptionRank[] = [];

            for (let i = 0; i < res.data.options.length; i++) {
                choices.push({
                    rank: i,
                    option: null
                });
            }

            this.setState({
                poll: res.data,
                choices: choices
            });
        }).catch(err => {
          console.log(err);
        });
    }

    private isValid = () => {
        if (!this.state.voter) {
            return false;
        }

        const seenBefore: string[] = [];

        return this.state.choices.every(or => {
            if (or.option) {
                if (seenBefore.indexOf(or.option) > -1) {
                    return false;
                }

                seenBefore.push(or.option);
            } else if (or.rank === 1) {
                return false;
            }

            return true;
        });
    }

    private sendVote = () => {
        axios.put('/api/vote', {
            id: this.state.poll_id,
            voter: this.state.voter,
            choices: this.state.choices
        }).then(res => {
            console.log('success');
        }).catch(err => {
            console.log('error');
        });
    }

    private changeRank = (rank: number, e: React.ChangeEvent<HTMLSelectElement>): void => {
        const choices = this.state.choices.slice(0);

        const optionRank = choices.find(x => x.rank == rank);
        if (optionRank) {
            optionRank.option = e.target.value
        }

        this.setState({
            choices: choices
        });
    }

    componentDidMount() {
        if (this.state.poll_id) {
            this.getPoll();
        }
    }

    render() {
        const options = this.state.poll && this.state.poll.options || [];
        return (
            <>
                {this.state.poll && <Link to={`/poll?poll_id=${this.state.poll.id}`}>Back to Poll</Link>}
                <h1>Vote page</h1>
                <div>
                    <input 
                        name='voter' 
                        value={this.state.voter} 
                        onChange={e => this.setState({'voter': e.target.value})} 
                        placeholder='Voter Name'
                    />
                </div>
                {this.state.poll && <table>
                    <tr>
                        <th>Rank</th>
                        <th>Option</th>
                    </tr>
                    {this.state.choices.map(or => 
                        <tr key={or.rank}>
                            <td>
                                {or.rank + 1}.
                            </td>
                            <td>
                                <select value={or.option || ''} onChange={e => this.changeRank(or.rank, e)}>
                                    <option>-- Select Option --</option>
                                    {options.map(o => 
                                        <option key={o} value={o}>{o}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                    )}
                </table>}
                <button disabled={!this.isValid()} onClick={this.sendVote}>Vote</button>
            </>
        );
    }
}