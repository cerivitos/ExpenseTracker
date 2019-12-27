<script>
  import { userInfo } from "../store/store";
</script>

<div class="flex flex-col mx-4 my-8">
  <img
    src={$userInfo.photo}
    alt="User photo"
    class="rounded-full w-24 h-24 ml-4" />
  <span class="text-xl font-bold">{$userInfo.name}</span>
</div>
