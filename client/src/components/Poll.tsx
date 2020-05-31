import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PollDto } from '../types';
import { getPoll } from '../api/poll';
import { getParam } from '../helpers';

type PollResults = {
  winner: string;
  resultsTable: any[];
}

type PollState = {
  results: PollResults | null;
}

export class Poll extends Component<{}, PollDto & PollState> {
  constructor(props: any) {
    super(props);
    
    const id = getParam('poll_id');

    this.state = {
      id: id,
      name: '',
      description: '',
      options: [],
      voters: [],
      results: null
    };
  }

  componentDidMount() {
    if (this.state.id) {
      this.getPoll();
    }
  }

  private getPoll = () => {
    if (!this.state.id) return;

    getPoll(this.state.id).then(res => {
      const poll = res.data;

      this.setState({
        name: poll.name,
        description: poll.description,
        options: poll.options,
        voters: poll.voters
      });
    }).catch(err => {
      console.log(err);
    });
  }

  private deletePoll = () => {
    axios.delete('/api/poll', {
      params: {
        id: this.state.id
      }
    });
  }

  private getWinner = () => {
    axios.get<PollResults>('/api/poll/getWinner', {
      params: {
        id: this.state.id
      }
    }).then(res => {
      this.setState({
        results: res.data
      });
    }).catch(err => {
      console.log('error while getting winner', err);
    })
  }

  private upsertPoll = () => {
    axios.post('/api/poll', this.state)
      .then(res => {
        console.log(res.data);

        this.setState({
          id: res.data
        });
      }).catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <Link to='/'>Back to Home</Link>
        <h2>Create a Poll</h2>
        <div>
          <input 
            type='text' 
            name='name' 
            value={this.state.name} 
            onChange={e => this.setState({'name': e.target.value})}
            placeholder='Name'
          />
        </div>
        <div>
          <input 
            type='text' 
            name='description' 
            value={this.state.description} 
            onChange={e => this.setState({'description': e.target.value})} 
            placeholder='Description'
          />
        </div>
        <div>
          <input 
            type='text' 
            name='options' 
            disabled={this.state.voters.length > 0}
            value={this.state.options.join(', ') || ''} 
            onChange={e => this.setState({'options': e.target.value.split(',').map(o => o.trim())})} 
            placeholder='Options (separated by commas)'
          />
        </div>
        <div>
          <button onClick={this.upsertPoll}>
            {this.state.id ? 'Update' : 'Create'}
          </button>
        </div>
        {this.state.id && <div>
          Total Votes: {this.state.voters.length}
        </div>}
        {this.state.id && <div>
          <Link to={`/vote?poll_id=${this.state.id}`} >Vote in Poll</Link>
        </div>}
        {this.state.id && <div>
          <Link to='/' onClick={this.deletePoll}>
            Delete Poll
          </Link>
        </div>}
        {this.state.id && <div>
          <button onClick={this.getWinner}>
            Get Poll Winner
          </button>
        </div>}
        {this.state.results && 
          <div>
            Winner: {this.state.results.winner}
            <table>
              <tr>
                <th>Round</th>
                {this.state.options.map(o => <th key={o}>{o}</th>)}
              </tr>
              {this.state.results.resultsTable.map((x, index) => 
                <tr key={index}>
                  <td>{index + 1}</td>
                  {this.state.options.map(o => <td key={o}>{x[o]}</td>)}
                </tr>
              )}
            </table>
          </div>
        }
      </div>
    );
  }
}