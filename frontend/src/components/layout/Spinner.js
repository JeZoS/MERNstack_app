import React,{Fragment} from 'react';
import source from './source.gif';

export default () => ( 
    <Fragment>
        <img 
            src={source}
            style={{width:'200px',margin:'auto',display:'block'}}
            alt='Loading'
        />
    </Fragment>

);