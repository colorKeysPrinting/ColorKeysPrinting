import React    from 'react';

export default function AddNewListOverlay(props) {

    const styles = {
        container: {
            backgroundColor: '#F9FAFC',
            borderRadius: '5px',
            border: '1px solid rgba(50, 50, 50, 0.4)',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            width: '490px',
            margin: '10em auto',
            zIndex: '999'
        },
        titleBar: {
            display: 'inline-flex',
            backgroundColor: '#FFF',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            boxShadow: '0px 2px 7px 0px rgba(50, 50, 50, 0.4)',
            height: '20%',
            width: '100%'
        },
        title: {
            textAlign: 'left',
            padding: '30px',
            width: '90%'
        },
        close: {
            cursor: 'pointer',
            textAlign: 'right',
            padding: '30px',
            width: '10%'
        },
        content: {
            width: '89%',
            margin: '0px auto',
            marginTop: '40px',
            textAlign: 'left'
        }
    };

    let title;
    switch (props.overlayObj.type) {
    case 'customMatchups':
        title = 'Custom Matchup';
        break;
    case 'myLists':
        title = 'List';
        break;
    default:
    }

    return (
        <div style={styles.container}>
            <div style={styles.titleBar}>
                <div style={styles.title}>Create New { title }</div>
                <div onClick={props.close} style={styles.close}>X</div>
            </div>
            <form onSubmit={() => props.submitCreateListBtn(props.overlayObj.type)}>
                <div style={styles.content}>
                    <div style={{ width: '95%', margin: 'auto' }}>Name your new {(title).toLowerCase()}</div>
                    <input type="text" placeholder="My Favorites" value={props.name} onChange={(e) => { props.update('name', e.target.value) }} style={{ width: '420px' }} required />
                </div>

                <input className="submit-btn" type="submit" value="Submit" style={{ width: '86%' }} />
            </form>
        </div>
    );
}
