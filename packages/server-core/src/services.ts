import { Application } from '../declarations';

// Types
import AuthenticationServices from './authentication/services';
import EntityServices from './entities/services';
import GraphQLServices from './graphql/services';
import MediaServices from './media/services';
import NetworkingServices from './networking/services';
import PaymentServices from './payments/services';
import SocialServices from './social/services';
import SocialMediaServices from './socialmedia/services';
import UserServices from './user/services';
import WorldServices from './world/services';

export default (app: Application): void => {
  [
    ...AuthenticationServices,
    ...EntityServices,
    ...GraphQLServices,
    ...MediaServices,
    ...NetworkingServices,
    ...PaymentServices,
    ...SocialServices,
    ...SocialMediaServices,
    ...UserServices,
    ...WorldServices
  ].forEach(service => {
    app.configure(service)
  })
};
