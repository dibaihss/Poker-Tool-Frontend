import {Injectable} from '@angular/core'
import {Action} from '@ngrx/store';

export const createRommView = 'createRommView'
export const deltype = 'del'
export const arab = 'arab'

// export const giveName = 'giveName'
// export const giveRoomID = 'giveRoomID'




export class CreateRommView implements Action{
    readonly type = createRommView
    constructor(public payload: boolean){

    }
}
export class ShowJoinView implements Action{
    readonly type = deltype
    constructor(public payload: boolean){

    }
}

export type Actions = CreateRommView | ShowJoinView