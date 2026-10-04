import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {getSessions} from '../api/sessions';
import {toDateKey} from '../utils/date';

function Sessions() {

  const [searchParams, setSearchParams] = useSearchParams();

  const readList=(name)=> {

    const value = searchParams.get(name);
    return value? value.split(','):[];
  };

  const venues= readList('venues');
  const formats= readList('formats');
  const languages= readList('languages');
  const times= readList('times');
  const date= searchParams.get('date') || toDateKey(new Date());
  const sort= searchParams.get('sort') || 'time_asc';
  const page= searchParams.get('page') || 1;



}