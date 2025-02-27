import { handleActions } from 'redux-actions';

import * as actions from '../actions/dnsConfig';
import { ALL_INTERFACES_IP, BLOCKING_MODES } from '../helpers/constants';

const DEFAULT_BLOCKING_IPV4 = ALL_INTERFACES_IP;
const DEFAULT_BLOCKING_IPV6 = '::';

const dnsConfig = handleActions(
    {
        [actions.getDnsConfigRequest]: (state) => ({ ...state, processingGetConfig: true }),
        [actions.getDnsConfigFailure]: (state) => ({ ...state, processingGetConfig: false }),
        [actions.getDnsConfigSuccess]: (state, { payload }) => {
            const {
                blocking_ipv4,
                blocking_ipv6,
                upstream_dns,
                fallback_dns,
                bootstrap_dns,
                local_ptr_upstreams,
                ...values
            } = payload;

            return {
                ...state,
                ...values,
                blocking_ipv4: blocking_ipv4 || DEFAULT_BLOCKING_IPV4,
                blocking_ipv6: blocking_ipv6 || DEFAULT_BLOCKING_IPV6,
                upstream_dns: (upstream_dns && upstream_dns.join('\n')) || '',
                fallback_dns: (fallback_dns && fallback_dns.join('\n')) || '',
                bootstrap_dns: (bootstrap_dns && bootstrap_dns.join('\n')) || '',
                local_ptr_upstreams: (local_ptr_upstreams && local_ptr_upstreams.join('\n')) || '',
                processingGetConfig: false,
            };
        },

        [actions.setDnsConfigRequest]: (state) => ({ ...state, processingSetConfig: true }),
        [actions.setDnsConfigFailure]: (state) => ({ ...state, processingSetConfig: false }),
        [actions.setDnsConfigSuccess]: (state, { payload }) => ({
            ...state,
            ...payload,
            processingSetConfig: false,
        }),
    },
    {
        processingGetConfig: false,
        processingSetConfig: false,
        blocking_mode: BLOCKING_MODES.default,
        ratelimit: 20,
        blocking_ipv4: DEFAULT_BLOCKING_IPV4,
        blocking_ipv6: DEFAULT_BLOCKING_IPV6,
        blocked_response_ttl: 10,
        edns_cs_enabled: false,
        disable_ipv6: false,
        dnssec_enabled: false,
        upstream_dns_file: '',
    },
);

export default dnsConfig;
