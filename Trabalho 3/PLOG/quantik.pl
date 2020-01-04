:- consult('display.pl').
:- consult('menu.pl').
:- consult('auxiliar.pl').
:- consult('computer.pl').
:- consult('data.pl').
:- consult('game.pl').

:- use_module(library(random)).
:- use_module(library(system)).

play :- menu.