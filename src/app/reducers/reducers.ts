import * as AppActions from "../actions/app.actions";

var stateI = false;

export function TrueForCreate(state = stateI, action: AppActions.Actions) {
  switch (action.type) {
    case AppActions.createRommView:
      console.log(state);

      var NameRoom = state;

      NameRoom = action.payload;

      return NameRoom;
    default:
      return state;
  }
}
var statein = true;
export function TrueForJoin(state = statein, action: AppActions.Actions) {
  switch (action.type) {
    case AppActions.deltype:
      console.log(state);

      var NameRoom = state;

      NameRoom = action.payload;

      return NameRoom;
    default:
      return state;
  }
}


