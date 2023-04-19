<template>
	<view class="content">
		<view class="text-area">
			<input type="text" v-model="title" placeholder="请输入发送内容" focus>
			<button type="primary" class="send" @click="getdl">发送</button>
			<!-- <text v-for="(item,index) in data" :key="index" id="content" class="text content" highlight selectable v-html="item"></text> -->
			<text selectable>
				<view class="text" highlight v-for="(item,index) in data">
					<MDParserHighlight :resource="item"></MDParserHighlight>
				</view>
			</text>
		</view>
	</view>
</template>

<script>
	import {
		marked
	} from 'marked';

	import MDParserHighlight from '../../components/cmder-MDParserHighlight/index.vue'
	import {
		crt,
		debounce
	} from "../../utli/index.js"
	export default {
		components: {
			MDParserHighlight
		},
		data() {
			return {
				title: '',
				data: [],
				messageId: '',
				v: 2,
				Isupdate: false, 
			}
		},
		methods: {
			/**
			 * 主业务代码
			 */
			async getdl() {
				if (!this.title) {
					uni.showToast({
						title: '请输入内容',
						icon: "error"
					})
					return
				}
				if (this.Isupdate) {
					this.update()
					return
				}
				uni.showLoading({
					title: '请求中',
					mask: true
				})
				try {
					let {
						data
					} = await uni.request({
						url: 'https://chatgpt.quxuetrip.com/api/chatgpt/get?stream=true&single=true',
						header: {
							"m": crt({
								messageId: this.messageId,
								idx: 999,
								message: this.title
							}),
							"ticket": 'hL_OYBjM9iPXoXH7Q_9iR2iTbvWlfdx7Ku__'
						}
					})
					let res = data.split('chatcmpl-')
					this.data.unshift(`${res[0].split('YNZ5XF4XNFPWNZ')[0]}`)
					this.messageId = 'chatcmpl-' + res[1]
					this.title = ""
				} catch (err) {

					uni.showToast({
						title: err.errMsg,
						icon: "error"
					})
				}
				uni.hideLoading()
			},
			/**
			 * 检测更新
			 */
			async update() {
				try {
					let {
						data
					} = await uni.request({
						url: "https://api.longans.top/static/img/GPTupdate.txt"
					})
					let {
						v, //版本
						updateurl, //直连
						content //内容
					} = data
					if (this.v != v) {
						this.Isupdate = true
						uni.showModal({
							showCancel: false,
							title: "更新",
							content: `${content}下载地址${updateurl}`,
							confirmText: "更新",
							success: (res) => {
								if (res.confirm) { //点击了确定
									this.downFile(updateurl)
								}
							}
						})
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
			},
			/**
			 * 下载器
			 */
			downFile(downurl) {
				var task = plus.downloader.createDownload(downurl, {
					filename: '_downloads/' // 文件保存路径
				});
				var updateLoadingTitle = debounce(function(progress) {
					uni.showLoading({
						title: '下载中 ' + progress + '%',
						mask: true
					});
				}, 200); // 设置延迟时间为 200ms
				task.addEventListener("statechanged", function(download, status) {
					if (download.state === 4 && status === 200) {
						plus.runtime.openFile(download.filename);
						uni.hideLoading();
					} else if (status > 0) {
						var progress = parseInt(download.downloadedSize / download.totalSize * 100);
						if (progress > 1) {
							updateLoadingTitle(progress); // 调用防抖函数更新加载提示框标题
						}
					}
				});
				uni.showLoading({
					title: '下载中',
					mask: true
				});
				task.start();
			}
		},
		onLoad() {
			this.update()
		},

	}
</script>

<style lang="scss">
	.content {
		padding: 32upx;

		.text-area {
			height: 100%;
		}

		.send {
			margin: 70upx 0;
		}

		.text {
			border: 2upx solid #1e80ff;
			padding: 24upx 18upx;
			border-radius: 16upx;
			margin: 32upx 0;
		}
	}
</style>