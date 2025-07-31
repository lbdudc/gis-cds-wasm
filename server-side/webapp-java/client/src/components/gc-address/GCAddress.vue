<template>
  <v-container>
    <v-form>
      <v-row dense>
        <!-- Form -->
        <v-col cols="12" md="6">
          <v-text-field
            dense
            v-model="address.line1"
            @input="updateAddress()"
            type="text"
            :label="$t('gc_address.line1')"
          ></v-text-field>
          <v-text-field
            dense
            v-model="address.line2"
            @input="updateAddress()"
            type="text"
            :label="$t('gc_address.line2')"
          ></v-text-field>
          <!-- Zipcode -->
          <v-row>
            <v-col cols="6">
              <number-field
                class="zipcode-field"
                type="Long"
                v-model="address.zipCode"
                @input="updateAddress()"
                :label="$t('gc_address.zipcode')"
              ></number-field>
            </v-col>
            <!-- Country -->
            <v-col cols="6">
              <autocomplete
                v-model="address.country"
                @input="updateAddress()"
                :items="countries"
                :label="$t('gc_address.country')"
                @change="fetchSubdivisions1()"
                :loading="loadingCountries || loadingSubdivisions1"
                item-text="name"
                :item-value="optionToEntity"
                return-object
              ></autocomplete>
            </v-col>
            <!-- Subdivision 1 -->
            <v-col
              cols="6"
              v-if="address.subdivision1 || subdivisions1.length > 0"
            >
              <autocomplete
                v-model="address.subdivision1"
                :items="subdivisions1"
                :label="$t('gc_address.subdivision1')"
                @change="fetchSubdivisions2()"
                @input="updateAddress()"
                :loading="loadingSubdivisions1 || loadingSubdivisions2"
                item-text="name"
                :item-value="optionToEntity"
              ></autocomplete>
            </v-col>
            <!-- Subdivision 2 -->
            <v-col
              cols="6"
              v-if="address.subdivision2 || subdivisions2.length > 0"
            >
              <autocomplete
                v-model="address.subdivision2"
                :items="subdivisions2"
                :label="$t('gc_address.subdivision2')"
                @change="fetchSubdivisions3()"
                @input="updateAddress()"
                :loading="loadingSubdivisions2 || loadingSubdivisions3"
                item-text="name"
                :item-value="optionToEntity"
              ></autocomplete>
            </v-col>
            <!-- Subdivision 3 -->
            <v-col
              cols="6"
              v-if="address.subdivision3 || subdivisions3.length > 0"
            >
              <autocomplete
                v-model="address.subdivision3"
                :items="subdivisions3"
                :label="$t('gc_address.subdivision3')"
                @change="fetchSubdivisions4()"
                @input="updateAddress()"
                :loading="loadingSubdivisions3 || loadingSubdivisions4"
                item-text="name"
                :item-value="optionToEntity"
              ></autocomplete>
            </v-col>
            <!-- Subdivision 4 -->
            <v-col
              cols="6"
              v-if="address.subdivision4 || subdivisions4.length > 0"
            >
              <autocomplete
                v-model="address.subdivision4"
                :items="subdivisions4"
                :label="$t('gc_address.subdivision4')"
                @change="fetchTowns()"
                @input="updateAddress()"
                :loading="loadingSubdivisions4 || loadingTowns"
                item-text="name"
                :item-value="optionToEntity"
              ></autocomplete>
            </v-col>
            <!-- Town -->
            <v-col cols="6" v-if="address.town || towns.length > 0">
              <autocomplete
                v-model="address.town"
                @input="updateAddress()"
                :loading="loadingTowns"
                :items="towns"
                :label="$t('gc_address.town')"
                item-text="name"
                :item-value="optionToEntity"
              ></autocomplete>
            </v-col>
          </v-row>
          <v-btn @click="searchAddress()" width="100%">
            {{ $t("gc_address.geolocate") }}
          </v-btn>
          <v-row>
            <v-col cols="6">
              <v-text-field
                type="text"
                v-model="address.point.coordinates[1]"
                :label="$t('gc_address.latitude')"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="text"
                v-model="address.point.coordinates[0]"
                :label="$t('gc_address.longitude')"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <!-- Map -->
        <v-col cols="12" md="6">
          <gc-map
            :address="addressForMap"
            :feature="address.point"
            geolocation
            @geolocated="fillLatLng"
            @searched="fillAddress"
          ></gc-map>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import Autocomplete from "@/components/debouncing-inputs/Autocomplete.vue";
import NumberField from "@/components/number-field/NumberField.vue";
import GCMap from "./GCMap";
import RepositoryFactory from "@/repositories/RepositoryFactory";

const GCAddressRepository = RepositoryFactory.get("GCAddressRepository");

export default {
  name: "GCAddress",
  components: {
    Autocomplete,
    NumberField,
    "gc-map": GCMap,
  },
  props: ["value"],
  data() {
    return {
      address: {
        line1: null,
        line2: null,
        zipCode: null,
        country: null,
        subdivision1: null,
        subdivision2: null,
        subdivision3: null,
        subdivision4: null,
        town: null,
        point: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [],
          },
        },
      },
      addressForMap: {},
      countries: [],
      loadingCountries: false,
      subdivisions1: [],
      loadingSubdivisions1: false,
      subdivisions2: [],
      loadingSubdivisions2: false,
      subdivisions3: [],
      loadingSubdivisions3: false,
      subdivisions4: [],
      loadingSubdivisions4: false,
      towns: [],
      loadingTowns: false,
    };
  },
  watch: {
    value: {
      handler: function (newVal) {
        if (newVal) {
          this.address = newVal;
          this.fetchDataForAddress();
        } else {
          this.address = {
            line1: null,
            line2: null,
            zipCode: null,
            country: null,
            subdivision1: null,
            subdivision2: null,
            subdivision3: null,
            subdivision4: null,
            town: null,
            point: {
              type: "Point",
              coordinates: [],
            },
          };
        }
      },
      immediate: true,
    },
  },
  created() {
    this.fetchDataForAddress();
  },
  methods: {
    updateAddress() {
      this.$emit("input", this.address);
    },
    fetchDataForAddress() {
      this.fetchCountries();
      for (let index = 1; index <= 5; index++) {
        if (index == 5) {
          if (this.address.town) this.fetchTowns();
        } else {
          if (this.address["subdivision" + index])
            this["fetchSubdivisions" + index]();
          else break;
        }
      }
    },
    optionToEntity(item) {
      return {
        id: item.id,
        type: item.type,
        code: item.code,
      };
    },
    fetchCountries() {
      this.loadingCountries = true;
      GCAddressRepository.getCountries()
        .then((data) => (this.countries = data))
        .finally(() => (this.loadingCountries = false));
    },
    async fetchSubdivisions1() {
      if (this.address && this.address.country) {
        this.loadingSubdivisions1 = true;
        await GCAddressRepository.getSubdivisions(this.address.country.code)
          .then((data) => (this.subdivisions1 = data))
          .finally(() => (this.loadingSubdivisions1 = false));
      } else this.subdivisions1.splice(0);
    },
    async fetchSubdivisions2() {
      if (this.address && this.address.subdivision1) {
        this.loadingSubdivisions2 = true;
        await GCAddressRepository.getSubdivisions(
          this.address.country.code,
          this.address.subdivision1.code
        )
          .then((data) => (this.subdivisions2 = data))
          .finally(() => (this.loadingSubdivisions2 = false));
      } else this.subdivisions2.splice(0);
    },
    async fetchSubdivisions3() {
      if (this.address && this.address.subdivision2) {
        this.loadingSubdivisions3 = true;
        await GCAddressRepository.getSubdivisions(
          this.address.country.code,
          this.address.subdivision1.code,
          this.address.subdivision2.code
        )
          .then((data) => (this.subdivisions3 = data))
          .finally(() => (this.loadingSubdivisions3 = false));
      } else this.subdivisions3.splice(0);
    },
    async fetchSubdivisions4() {
      if (this.address && this.address.subdivision3) {
        this.loadingSubdivisions4 = true;
        await GCAddressRepository.getSubdivisions(
          this.address.country.code,
          this.address.subdivision1.code,
          this.address.subdivision2.code,
          this.address.subdivision3.code
        )
          .then((data) => (this.subdivisions4 = data))
          .finally(() => (this.loadingSubdivisions4 = false));
      } else this.subdivisions4.splice(0);
    },
    async fetchTowns() {
      if (this.address && this.address.subdivision4) {
        this.loadingTowns = true;
        await GCAddressRepository.getSubdivisions(
          this.address.country.code,
          this.address.subdivision1.code,
          this.address.subdivision2.code,
          this.address.subdivision3.code,
          this.address.subdivision4.code
        )
          .then((data) => (this.towns = data))
          .finally(() => (this.loadingTowns = false));
      } else this.towns.splice(0);
    },
    searchAddress() {
      let formattedAddress = JSON.parse(JSON.stringify(this.address));

      formattedAddress.country = this.countries.find(
        (c) => this.address.country.id === c.id
      );
      if (formattedAddress.subdivision1)
        formattedAddress.subdivision1 = this.countries.find(
          (c) => this.address.subdivision1.id === c.id
        );
      if (formattedAddress.subdivision2)
        formattedAddress.subdivision2 = this.subdivisions2.find(
          (s) => this.address.subdivision2.id === s.id
        );
      if (formattedAddress.subdivision3)
        formattedAddress.subdivision3 = this.subdivisions3.find(
          (s) => this.address.subdivision3.id === s.id
        );
      if (formattedAddress.subdivision4)
        formattedAddress.subdivision4 = this.subdivisions4.find(
          (s) => this.address.subdivision4.id === s.id
        );
      if (formattedAddress.town)
        formattedAddress.town = this.towns.find(
          (t) => this.address.towns.id === t.id
        );

      this.addressForMap = formattedAddress;
    },
    fillLatLng(latLng) {
      this.address.point.coordinates = [];
      this.address.point.coordinates.push(latLng.lng);
      this.address.point.coordinates.push(latLng.lat);
      this.updateAddress();
    },
    fillAddress(results, latLng) {
      this.address = {
        line1: null,
        line2: null,
        zipCode: null,
        country: null,
        subdivision1: null,
        subdivision2: null,
        subdivision3: null,
        subdivision4: null,
        town: null,
        point: {
          type: "Point",
          coordinates: [],
        },
      }; // reset address object
      this._setSearchResults(results); // fill address props with results
      this._searchResultsToGCAddress(); // convert address props to GCAddress format
      this.fillLatLng(latLng);
    },
    _setSearchResults(results) {
      results.forEach((field) => {
        if (field.types.includes("administrative_area_level_5"))
          this.address.town = field;
        else if (field.types.includes("administrative_area_level_4"))
          this.address.subdivision4 = field;
        else if (field.types.includes("administrative_area_level_3"))
          this.address.subdivision3 = field;
        else if (field.types.includes("administrative_area_level_2"))
          this.address.subdivision2 = field;
        else if (field.types.includes("administrative_area_level_1"))
          this.address.subdivision1 = field;
        else if (field.types.includes("country")) this.address.country = field;
        else if (field.types.includes("postal_code"))
          this.address.zipcode = field.long_name;
        else
          this.address.line1 = this.address.line1
            ? this.address.line1.concat(", " + field.long_name)
            : field.long_name;
      });
    },
    async _searchResultsToGCAddress() {
      this.address.country = this.countries.find(
        (el) =>
          el.name === this.address.country.long_name ||
          el.code === this.address.country.short_name
      );
      await this.fetchSubdivisions1();
      this.address.subdivision1 = this.subdivisions1.find(
        (el) =>
          el.name === this.address.subdivision1.long_name ||
          el.code === this.address.subdivision1.short_name
      );

      for (let index = 2; index < 5; index++) {
        if (index === 4) {
          await this.fetchTowns();
          if (this.address.town) {
            let town = this.towns.find(
              (el) =>
                el.name === this.address.town.long_name ||
                el.code === this.address.town.short_name
            );
            this.address.town = town ? town : null;
          } else this.address.town = null;
        } else {
          await this["fetchSubdivisions" + index]();
          if (this.address["subdivision" + index])
            this.address["subdivision" + index] = this[
              "subdivisions" + index
            ].find(
              (el) =>
                el.name === this.address["subdivision" + index].long_name ||
                el.code === this.address["subdivision" + index].short_name
            );
          else this.address["subdivision" + index] = null;
        }
      }
    },
  },
};
</script>

<style scoped>
.zipcode-field {
  padding-top: 18px !important;
}
</style>
