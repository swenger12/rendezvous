<template>
    <div>
        <h4 class="display-1">Set Core Hours</h4>

        <instructions details="Set Hours of Availability." />
        <b-form inline>
            <label class="sr-only" for="inlineFormInputName2">Monday</label>

            <v-text-field>label = "Start Time"</v-text-field>


            <b-input class="mb-2 mr-sm-2 mb-sm-0" id="inlineFormInputName2" placeholder="Jane Doe" />
            <label class="sr-only" for="inlineFormInputGroupUsername2">Username</label>
            <b-input-group left="@" class="mb-2 mr-sm-2 mb-sm-0">
                <b-input id="inlineFormInputGroupUsername2" placeholder="Username" />
            </b-input-group>
            <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>
            <b-button variant="primary">Save</b-button>
        </b-form>





    </div>
</template>

<script>
    import Instructions from "../components/Instructions";
    export default {
        name: "core-hours",
        components: {Instructions}
    }
</script>

<style scoped>

</style>