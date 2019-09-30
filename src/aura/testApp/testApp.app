<!--
 - Created by kiet.truong on 9/26/2019.
 -->

<aura:application extends="force:slds">
    <!-- Create attribute to store lookup value as a sObject-->
    <aura:attribute name="selectedLookUpRecord" type="sObject" default="{}"/>

    <c:customLookup objectAPIName="account" IconName="standard:account" selectedRecord="{!v.selectedLookUpRecord}" label="Contact"/>
    <!-- here c: is org. namespace prefix-->
</aura:application>
