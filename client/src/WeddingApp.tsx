import React, { Component } from "react";
import "./styles.css";
import { GuestList } from "./GuestList";
import { AddGuest } from "./AddGuest";
import { GuestDetails } from "./GuestDetails";


type Page = {kind: "GuestList"} | {kind: "AddGuest"} | {kind: "GuestDetails", name: string};

type WeddingAppState = {
  show: Page
};

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {show: {kind: "GuestList"}};
  }
  
  render = (): JSX.Element => {
    if (this.state.show.kind === "GuestList") {
      return <div>
      <GuestList onAddGuestClick={this.doAddGuestClick} onGuestClick={this.doGuestClick}></GuestList>
      </div>;
    } else if (this.state.show.kind === "AddGuest") {
      return <div>
        <AddGuest onBackClick={this.doBackClick}></AddGuest>
      </div>;
    } else {
      return <div>
        <GuestDetails name={this.state.show.name} onBackClick={this.doBackClick}></GuestDetails>
      </div>;
    }
  };

  
  // Updates the UI to show the AddGuest
  doAddGuestClick = (): void => {
    this.setState({show: {kind: "AddGuest"}});
  };

  // Updates the UI to show the GuestDetails
  doGuestClick = (name: string): void => {
    this.setState({show: {kind: "GuestDetails", name}});
  };

  // Updates the UI to show the GuestList
  doBackClick = (): void => {
    this.setState({show: {kind: "GuestList"}});
  };
}
