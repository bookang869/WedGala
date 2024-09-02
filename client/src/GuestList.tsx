import React, { Component, MouseEvent } from "react";
import { Guest, GuestsOfHost, manageRange, parseGuests, parseSummary } from "./guest";
import { isRecord } from "./record";


type GuestListProps = {
  onAddGuestClick : () => void,
  onGuestClick : (name: string) => void
};


type GuestListState = {
  guests: Guest[] | undefined;
  guestsOfHost: GuestsOfHost;
};


/** Displays the list of created design files. */
export class GuestList extends Component<GuestListProps, GuestListState> {

  constructor(props: GuestListProps) {
    super(props);

    this.state = {guests: undefined, guestsOfHost: {minGuestsMolly: 0, maxGuestsMolly: 0, minGuestsJames: 0, maxGuestsJames: 0, numFamilyMolly: 0, numFamilyJames: 0}};
  }

  componentDidMount = (): void => {
    fetch("/api/list").then(this.doListResp)
        .catch(() => this.doListError("failed to connect to server"));
  };

  render = (): JSX.Element => {
    return (<div>
        <h1>Guest List</h1>
        {this.renderGuests()}
        
        <h3>Summary:</h3>
        <p>{manageRange(this.state.guestsOfHost.minGuestsMolly, this.state.guestsOfHost.maxGuestsMolly)} guest(s) of Molly ({this.state.guestsOfHost.numFamilyMolly.toString()} family)<br></br>
        {manageRange(this.state.guestsOfHost.minGuestsJames, this.state.guestsOfHost.maxGuestsJames)} guest(s) of James ({this.state.guestsOfHost.numFamilyJames.toString()} family)</p>
        <button onClick={this.doAddGuestClick}>Add Guest</button>
      </div>);
  };

  renderGuests = (): JSX.Element => {
    if (this.state.guests === undefined) {
      return <p></p>;
    } else {
      const guests: JSX.Element[] = [];
      for (const guest of this.state.guests) {
        guests.push(<li key={guest.name}>
          <a href="#" onClick={(evt) => this.doGuestClick(evt, guest.name)}>{guest.name}</a>
          {"   Guest of " + guest.host + "   " + guest.guestConfirmed}
        </li>);
      }
      return <ul>{guests}</ul>;
    }
  };

  doListResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doListJson)
          .catch(() => this.doListError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doListError)
          .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code from /api/list: ${resp.status}`);
    }
  };

  doListJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/list: not a record", data);
      return;
    }

    if (!Array.isArray(data.guests)) {
      console.error("bad data from /api/list: guests is not an array", data);
      return;
    }

    const summary = parseSummary(data.summary);
    if (summary === undefined) {
      return;
    }

    const guests: Guest[] = [];
    for (const val of data.guests) {
      const guest = parseGuests(val);
      if (guest === undefined)
        return;
      guests.push(guest);
    }
    this.setState({guests: guests, guestsOfHost: summary});
  };

  doListError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };

  doAddGuestClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onAddGuestClick();
  };

  doGuestClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
    evt.preventDefault();
    this.props.onGuestClick(name);
  };
}
