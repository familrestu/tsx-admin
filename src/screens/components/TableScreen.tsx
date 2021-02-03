import React, { Component } from 'react';
import Page from 'components/Page';
import Table from 'components/Table';
import Column from 'components/Column';

class TableScreen extends Component {
    render() {
        return (
            <Page breadCrumb="Components|Table">
                <Table datasource="components/ExampleTable">
                    <Column label="Column 1" name="column_1" />
                    <Column label="Column Masked 2" name="column_2" masking="A=ABCDEFG,B=HIJKLMN" />
                    <Column label="Date Column" name="column_3" type="date" format="DD-MMM-YYYY" align="right" />
                    <Column label="Time Column" name="column_4" type="time" />
                    <Column label="Number Column" name="column_5" type="number" />
                    <Column label="Wrong Column" name="column_21" />
                    <Column label="Column 7" name="column_7" />
                    <Column label="Column 8" name="column_8" />
                    <Column label="Column 9" name="column_9" />
                    <Column label="Column 10" name="column_10" />
                    <Column label="Column 11" name="column_11" />
                    <Column label="Column 12" name="column_12" />
                    <Column label="Column 13" name="column_13" />
                    <Column label="Column 14" name="column_14" />
                    <Column label="Column 15" name="column_15" />
                    <Column label="Column 16" name="column_16" />
                    <Column label="Column 17" name="column_17" />
                    <Column label="Column 18" name="column_18" />
                    <Column label="Column 19" name="column_19" />
                    <Column label="Column 20" name="column_20" />
                </Table>

                <Table datasource="components/ExampleTable">
                    <Column label="Column 1" name="column_1" />
                    <Column label="Column Masked 2" name="column_2" masking="A=ABCDEFG,B=HIJKLMN" />
                    <Column label="Date Column" name="column_3" type="date" format="DD-MMM-YYYY" align="right" />
                    <Column label="Time Column" name="column_4" type="time" />
                    <Column label="Number Column" name="column_5" type="number" />
                    <Column label="Wrong Column" name="column_21" />
                    <Column label="Column 7" name="column_7" />
                    <Column label="Column 8" name="column_8" />
                    <Column label="Column 9" name="column_9" />
                    <Column label="Column 10" name="column_10" />
                    <Column label="Column 11" name="column_11" />
                    <Column label="Column 12" name="column_12" />
                    <Column label="Column 13" name="column_13" />
                    <Column label="Column 14" name="column_14" />
                    <Column label="Column 15" name="column_15" />
                    <Column label="Column 16" name="column_16" />
                    <Column label="Column 17" name="column_17" />
                    <Column label="Column 18" name="column_18" />
                    <Column label="Column 19" name="column_19" />
                    <Column label="Column 20" name="column_20" />
                </Table>
            </Page>
        );
    }
}

export default TableScreen;
