import React from 'react'

export function render_receipt(receipt, classes) {
    if (receipt) {
        return Object.keys(receipt).map((key) => {
            return <span className={classes.receiptLine}>
                        <div className={classes.receiptKey}>{key}:</div>
                        <div>{receipt[key]}</div>
                    </span>
        })
    }
}