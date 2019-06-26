/*
    © 2019, Salesforce.org.
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

    * Neither the name of Salesforce.org nor the names of
      its contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    'AS IS' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
    LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
    FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
    COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
    INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
    BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
    LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
    ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
    POSSIBILITY OF SUCH DAMAGE.
*/
/**
 * @author Salesforce.org
 * @date 2019
 * @group
 * @group-content
 * @description This component represents a single section within the custom fields layout for Single Gift Entry
 **/
import {LightningElement, api, track} from 'lwc';

export default class SGE_FormSection extends LightningElement {
    @api section;
    @api sobject;
    @api disableinputs;
    @track expanded = true;

    /**
     * @returns {*} Object where keys are field API names, and values are the value in the field.
     */
    @api
    get values() {
        const fields = this.template.querySelectorAll('c-sge_form-field');
        let oppData = {};
        if(fields !== null && typeof fields !== 'undefined') {
            fields.forEach(field => {
                oppData = { ...oppData, ...(field.fieldObject) };
            });
        }
        return oppData;
    }

    @api
    getInvalidFields() {
        const fields = this.template.querySelectorAll('c-sge_form-field');
        let invalidFields = [];

        fields.forEach(f => {
            if(!f.isValid()) {
                invalidFields.push(f);
            }
        });

        return invalidFields;
    }

    get iconName() {
        return this.expanded ? 'utility:chevrondown' : 'utility:chevronright';
    }

    get sectionClassName() {
        return this.expanded ? '' : 'slds-hidden';
    }

    toggleExpand(event) {
        event.preventDefault();
        this.expanded = !this.expanded;
    }

    /**
     * TRUE when there is at least one field inside of any column or section
     * @returns {boolean}
     */
    hasCustomFields() {
        let layoutHasFields = false;
        const columns = section.columns;
        if (Array.isArray(columns)) {
            columns.forEach(column => {
                if (Array.isArray(column.fields) && column.fields.length > 0) {
                    layoutHasFields = true;
                }
            });
        }
    }
}