import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { Guest, parseGuests } from './guest';
import { isRecord } from './record';

type GuestDetailsProps = {
  name: string;
  onBackClick: () => void;
};

type GuestDetailsState = {
  guest: Guest | undefined;
  restrictions: string;
  numGuest: string;
  guestName: string;
  guestRestrictions: string;
  error: string;
};


// Shows an individual auction and allows bidding (if ongoing).
export class GuestDetails extends Component<GuestDetailsProps, GuestDetailsState> {

  constructor(props: GuestDetailsProps) {
    super(props);

    this.state = {guest: undefined, restrictions: '', numGuest: 'unknown', guestName: '', guestRestrictions: '', error: ''};
  }
  
  componentDidMount = (): void => {
    fetch("/api/get?name=" + encodeURIComponent(this.props.name))
    .then(this.doGetResp)
    .catch(() => this.doGetError("failed to connect to server"));
  }

  render = (): JSX.Element => {
    if (this.state.guest === undefined) {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <h1>Guest Details</h1>
        {this.renderGuestInfo(this.state.guest)}
        <div>
          <label htmlFor="restrictions">Dietary Restrictions: (Specify "none" if none)</label><br></br>
          <input type="text" id="restrictions" value={this.state.restrictions}
              onChange={this.doRestrictionsChange}></input><br></br><br></br>
        </div>
        <div>
          <label htmlFor="additional">Additional Guest? </label>
          <select value={this.state.numGuest} onChange={this.doNumGuestChange}>
              <option>Unknown</option>
              <option value = "0">0</option>
              <option value = "1">1</option>
            </select><br></br>
            {this.renderAddGuest()}
        </div>
        <button type="button" onClick={this.doSaveClick} style={{marginRight: '5px' }}>Save</button>
        <button type="button" onClick={this.doBackClick} style={{marginRight: '5px' }}>Back</button>
        {this.renderError()}
      </div>);
  };

  renderGuestInfo = (guest: Guest): JSX.Element => {
    if (guest.isFamily) {
      return <p>{guest.name}, guest of {guest.host}, family</p>;
    } else {
      return <p>{guest.name}, guest of {guest.host}</p>
    }
  };

  renderAddGuest = (): JSX.Element => {
    if (this.state.numGuest === "1") {
      return <div>
        <div>
          <label htmlFor="name">Guest Name: </label>
          <input type="text" id="name" value={this.state.guestName} 
              onChange={this.doGuestNameChange}></input><br></br>
        </div>
        <div>
          <label htmlFor="restrictions">Guest Dietary Restrictions: (Specify "none" if none)</label><br></br>
          <input type="text" id="restrictions" value={this.state.guestRestrictions} 
              onChange={this.doGuestRestrictionsChange}></input><br></br><br></br>
        </div>
      </div>;
    } else {
      return <div></div>;
    }
  };

  renderError = (): JSX.Element => {
    if (this.state.error.length === 0) {
      return <div></div>;
    } else {
      const style = {width: '300px', backgroundColor: 'rgb(246,194,192)',
          border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px' };
      return (<div style={{marginTop: '15px'}}>
          <span style={style}><b>Error</b>: {this.state.error}</span>
        </div>);
    }
  };

  doGetResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doGetJson)
          .catch(() => this.doGetError("200 res is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doGetError)
          .catch(() => this.doGetError("400 response is not text"));
    } else {
      this.doGetError(`bad status code from /api/get: ${res.status}`);
    }
  };

  doGetJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/get: not a record", data);
      return;
    }

    this.doGuestChange(data);
  }

  doGuestChange = (data: {guest?: unknown}): void => {
    const guest = parseGuests(data.guest);
    if (guest !== undefined) {
      this.setState({guest: guest, restrictions: guest.restrictions, numGuest: guest.numGuest, guestName: guest.guestName, guestRestrictions: guest.guestRestrictions, error: ''});
    } else {
      console.error("guest from /api/get did not parse", data.guest)
    }
  };

  doGetError = (msg: string): void => {
    console.error(`Error fetching /api/get: ${msg}`);
  };

  doRestrictionsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({restrictions: evt.target.value, error: ""});
  };

  doNumGuestChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({numGuest: evt.target.value, error: ""});
  };

  doGuestNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({guestName: evt.target.value, error: ""});
  };

  doGuestRestrictionsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({guestRestrictions: evt.target.value, error: ""});
  };

  doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // Verify that the user entered all required information.
    if (this.state.restrictions.trim().length === 0 ||
        this.state.guestName.trim().length === 0 && this.state.numGuest === "1" ||
        this.state.guestRestrictions.trim().length === 0 && this.state.numGuest === "1") {
      this.setState({error: "Must speicify any dietary restrictions or 'none'."});
      return;
    }
    const guestDetailedInfo = {name: this.props.name,
                               restrictions: this.state.restrictions, 
                               numGuest: this.state.numGuest,
                               guestName: this.state.guestName,
                               guestRestrictions: this.state.guestRestrictions};
    fetch("/api/save", {
        method: "POST", body: JSON.stringify(guestDetailedInfo),
        headers: {"Content-Type": "application/json"} })
      .then(this.doSaveResp)
      .catch(() => this.doSaveError("failed to connect to server"));
  };

  doSaveResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doSaveJson)
          .catch(() => this.doSaveError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doSaveError)
          .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doSaveError(`bad status code from /api/bid: ${res.status}`);
    }
  };

  doSaveJson = (data: unknown): void => {
    if (this.state.guest === undefined)
      throw new Error("impossible");

    if (!isRecord(data)) {
      console.error("bad data from /api/bid: not a record", data);
      return;
    }

    this.doGuestChange(data);
  };

  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };

  doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBackClick();
  };
}
